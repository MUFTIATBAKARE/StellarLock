/**
 * Stellar network + connection config.
 *
 * When the contracts are deployed, fill in the contract ids and RPC url.
 * The rest of the app reads from these constants so wiring real bindings
 * is isolated to lib/token-locker.ts + lib/lp-locker.ts.
 */

export const NETWORK = {
  /** "TESTNET" | "PUBLIC" */
  passphrase: "Test SDF Network ; September 2015",
  rpcUrl: "https://soroban-testnet.stellar.org",
  horizonUrl: "https://horizon-testnet.stellar.org",
  networkName: "testnet" as const,
}

export const CONTRACTS = {
  /** TODO: replace with deployed Token Locker contract id (C...) */
  tokenLocker: "CTOKENLOCKER_CONTRACT_ID_PLACEHOLDER_000000000000000000",
  /** TODO: replace with deployed LP Locker contract id (C...) */
  lpLocker: "CLPLOCKER_CONTRACT_ID_PLACEHOLDER_00000000000000000000",
}

/** How long to pretend network calls take, so loading states are visible. */
export const MOCK_LATENCY_MS = 450

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Build a Stellar Expert explorer link for an address on the active network. */
export function explorerLink(address: string): string {
  return `https://stellar.expert/explorer/${NETWORK.networkName}/contract/${address}`
}
