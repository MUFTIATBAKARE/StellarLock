import {
  Address,
  nativeToScVal,
  xdr,
} from "@stellar/stellar-sdk"
import type { Dex, Lock } from "@/types/lock"
import { CONTRACTS, simulateCall, submitCall } from "@/lib/stellar"

export interface CreateLpLockArgs {
  poolShareAddress: string
  dex: Dex
  tokenA: string
  tokenB: string
  amount: number
  beneficiary: string
  unlockAt: number // unix seconds
}

// ── Converters ────────────────────────────────────────────────────────────────

function toLpLock(raw: Record<string, unknown>): Lock {
  const poolShare = raw.pool_share as string
  const dex = (raw.dex as string).toLowerCase() as Dex
  const tokenA = raw.token_a as string
  const tokenB = raw.token_b as string

  return {
    id: String(raw.id),
    kind: "lp",
    status: raw.withdrawn
      ? "withdrawn"
      : Number(raw.unlock_at) * 1000 <= Date.now()
      ? "unlockable"
      : "locked",
    token: {
      address: poolShare,
      symbol: `${tokenA.slice(0, 4)}-${tokenB.slice(0, 4)} LP`,
      name: `${tokenA.slice(0, 6)}/${tokenB.slice(0, 6)} Pool Share`,
      decimals: 7,
    },
    dex,
    poolPair: [tokenA, tokenB],
    creator: raw.creator as string,
    beneficiary: raw.beneficiary as string,
    amount: Number(raw.amount) / 1e7,
    usdValue: 0,
    createdAt: Number(raw.created_at) * 1000,
    unlockAt: Number(raw.unlock_at) * 1000,
    extendedCount: Number(raw.extended_count),
  }
}

function idArg(id: string): xdr.ScVal {
  return nativeToScVal(BigInt(id), { type: "u64" })
}

function addressArg(addr: string): xdr.ScVal {
  return new Address(addr).toScVal()
}

// ── Read methods ──────────────────────────────────────────────────────────────

export async function getLpLocksByCreator(address: string): Promise<Lock[]> {
  const raw = await simulateCall<Record<string, unknown>[]>(
    CONTRACTS.lpLocker,
    "get_locks_by_creator",
    [addressArg(address)],
  )
  return (raw ?? []).map(toLpLock)
}

export async function getLpLocksByBeneficiary(address: string): Promise<Lock[]> {
  const raw = await simulateCall<Record<string, unknown>[]>(
    CONTRACTS.lpLocker,
    "get_locks_by_beneficiary",
    [addressArg(address)],
  )
  return (raw ?? []).map(toLpLock)
}

// ── Write methods ─────────────────────────────────────────────────────────────

export async function createLpLock(
  args: CreateLpLockArgs,
  sourceAddress: string,
  signTransaction: (xdr: string) => Promise<{ signedTxXdr: string }>,
): Promise<{ id: string }> {
  const scArgs: xdr.ScVal[] = [
    addressArg(sourceAddress),
    addressArg(args.poolShareAddress),
    nativeToScVal(args.dex),
    addressArg(args.tokenA),
    addressArg(args.tokenB),
    nativeToScVal(BigInt(Math.round(args.amount * 1e7)), { type: "i128" }),
    addressArg(args.beneficiary),
    nativeToScVal(BigInt(Math.floor(args.unlockAt)), { type: "u64" }),
  ]

  await submitCall(CONTRACTS.lpLocker, "create_lock", scArgs, sourceAddress, signTransaction)
  return { id: "pending" }
}

export async function withdrawLpLock(
  id: string,
  sourceAddress: string,
  signTransaction: (xdr: string) => Promise<{ signedTxXdr: string }>,
): Promise<void> {
  await submitCall(CONTRACTS.lpLocker, "withdraw", [idArg(id)], sourceAddress, signTransaction)
}

export async function extendLpLock(
  id: string,
  newUnlockAt: number,
  sourceAddress: string,
  signTransaction: (xdr: string) => Promise<{ signedTxXdr: string }>,
): Promise<void> {
  await submitCall(
    CONTRACTS.lpLocker,
    "extend",
    [idArg(id), nativeToScVal(BigInt(Math.floor(newUnlockAt)), { type: "u64" })],
    sourceAddress,
    signTransaction,
  )
}
