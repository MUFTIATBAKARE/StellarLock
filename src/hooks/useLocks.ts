import { useAsync } from "@/hooks/useAsync"
import { getLock, getLocksByToken } from "@/lib/token-locker"
import {
  getLocksByCreator,
  getLocksByBeneficiary,
} from "@/lib/token-locker"
import {
  getLpLocksByBeneficiary,
  getLpLocksByCreator,
} from "@/lib/lp-locker"
import type { Lock } from "@/types/lock"

/** Single lock by id (used by the detail page). */
export function useLock(id: string | undefined) {
  return useAsync(() => (id ? getLock(id) : Promise.resolve(null)), [id])
}

/** Public explorer: all locks for a token address. */
export function useLocksByToken(tokenAddress: string | undefined) {
  return useAsync(
    () => (tokenAddress ? getLocksByToken(tokenAddress) : Promise.resolve(null)),
    [tokenAddress],
  )
}

/** Connected user's locks, split into created vs received (token + LP combined). */
export function useMyLocks(address: string | null) {
  return useAsync(async () => {
    if (!address) return { created: [] as Lock[], received: [] as Lock[] }
    const [tCreated, lpCreated, tReceived, lpReceived] = await Promise.all([
      getLocksByCreator(address),
      getLpLocksByCreator(address),
      getLocksByBeneficiary(address),
      getLpLocksByBeneficiary(address),
    ])
    const created = [...tCreated, ...lpCreated]
    // "received" = locks where you're the beneficiary but not the creator
    const received = [...tReceived, ...lpReceived].filter((l) => l.creator !== address)
    return { created, received }
  }, [address])
}
