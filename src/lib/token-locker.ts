import type { Lock, TokenLockSummary } from "@/types/lock"
import { MOCK_LOCKS } from "@/lib/mock-data"
import { MOCK_LATENCY_MS, sleep } from "@/lib/stellar"

/**
 * Token Locker contract bindings.
 *
 * Each function mirrors a contract method. They currently resolve against
 * mock data so the UI is fully functional pre-deployment. To go live, replace
 * the body of each function with a Soroban contract invocation (read methods
 * via simulation, write methods via a signed + submitted transaction) while
 * keeping the same signatures — nothing else in the app needs to change.
 */

export interface CreateTokenLockArgs {
  tokenAddress: string
  amount: number
  beneficiary: string
  unlockAt: number
  vesting?: { start: number; end: number }
}

// --- read methods -----------------------------------------------------------

export async function getLock(id: string): Promise<Lock | null> {
  await sleep(MOCK_LATENCY_MS)
  return MOCK_LOCKS.find((l) => l.id === id) ?? null
}

export async function getLocksByCreator(address: string): Promise<Lock[]> {
  await sleep(MOCK_LATENCY_MS)
  return MOCK_LOCKS.filter((l) => l.creator === address && l.kind === "token")
}

export async function getLocksByBeneficiary(address: string): Promise<Lock[]> {
  await sleep(MOCK_LATENCY_MS)
  return MOCK_LOCKS.filter((l) => l.beneficiary === address && l.kind === "token")
}

/** Powers the public explorer page: all locks for a given token address. */
export async function getLocksByToken(tokenAddress: string): Promise<TokenLockSummary | null> {
  await sleep(MOCK_LATENCY_MS)
  const locks = MOCK_LOCKS.filter(
    (l) => l.token.address === tokenAddress && l.kind === "token",
  )
  if (locks.length === 0) return null

  const active = locks.filter((l) => l.status !== "withdrawn")
  const totalLocked = active.reduce((sum, l) => sum + l.amount, 0)
  const totalUsdValue = active.reduce((sum, l) => sum + l.usdValue, 0)
  const upcoming = active
    .filter((l) => l.status === "locked")
    .map((l) => l.unlockAt)
    .sort((a, b) => a - b)

  return {
    token: locks[0].token,
    totalLocked,
    totalUsdValue,
    activeLocks: active.length,
    nextUnlockAt: upcoming[0] ?? null,
    percentOfSupply: 42,
    locks,
  }
}

// --- write methods -----------------------------------------------------------

export async function createTokenLock(args: CreateTokenLockArgs): Promise<{ id: string }> {
  await sleep(MOCK_LATENCY_MS)
  // TODO: invoke token_locker.create_lock(args) and return the emitted lock id.
  return { id: String(Math.floor(1000 + Math.random() * 9000)) }
}

export async function withdrawLock(id: string): Promise<void> {
  await sleep(MOCK_LATENCY_MS)
  // TODO: invoke token_locker.withdraw(id)
}

export async function extendLock(id: string, newUnlockAt: number): Promise<void> {
  await sleep(MOCK_LATENCY_MS)
  // TODO: invoke token_locker.extend(id, new_unlock_at)
  void newUnlockAt
}
