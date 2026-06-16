import type { Dex, Lock } from "@/types/lock"
import { MOCK_LOCKS } from "@/lib/mock-data"
import { MOCK_LATENCY_MS, sleep } from "@/lib/stellar"

/**
 * LP Locker contract bindings.
 *
 * Same pattern as token-locker.ts — mock-backed today, swap in real Soroban
 * invocations later without changing call sites.
 */

export interface CreateLpLockArgs {
  poolShareAddress: string
  dex: Dex
  amount: number
  beneficiary: string
  unlockAt: number
}

export async function getLpLocksByCreator(address: string): Promise<Lock[]> {
  await sleep(MOCK_LATENCY_MS)
  return MOCK_LOCKS.filter((l) => l.creator === address && l.kind === "lp")
}

export async function getLpLocksByBeneficiary(address: string): Promise<Lock[]> {
  await sleep(MOCK_LATENCY_MS)
  return MOCK_LOCKS.filter((l) => l.beneficiary === address && l.kind === "lp")
}

export async function createLpLock(args: CreateLpLockArgs): Promise<{ id: string }> {
  await sleep(MOCK_LATENCY_MS)
  // TODO: invoke lp_locker.create_lock(args)
  return { id: String(Math.floor(1000 + Math.random() * 9000)) }
}

export async function withdrawLpLock(id: string): Promise<void> {
  await sleep(MOCK_LATENCY_MS)
  // TODO: invoke lp_locker.withdraw(id)
}

export async function extendLpLock(id: string, newUnlockAt: number): Promise<void> {
  await sleep(MOCK_LATENCY_MS)
  // TODO: invoke lp_locker.extend(id, new_unlock_at)
  void newUnlockAt
}
