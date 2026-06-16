import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

/**
 * Wallet context backed by a mock connection for now.
 *
 * To wire real wallets, instantiate StellarWalletsKit here and replace
 * connect()/disconnect()/signTx() with kit calls. The rest of the app only
 * depends on { address, isConnected, connect, disconnect }.
 */

const MOCK_ADDRESS = "GBEXAMPLEUSERWALLETADDRESS7Q2WERTYUIOPASDFGHJKLZXCVBNM"
const STORAGE_KEY = "stellarlock:wallet"

interface WalletContextValue {
  address: string | null
  isConnected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (saved) setAddress(saved)
  }, [])

  const connect = useCallback(async () => {
    setConnecting(true)
    // TODO: kit.openModal({ onWalletSelected }) -> kit.getAddress()
    await new Promise((r) => setTimeout(r, 600))
    setAddress(MOCK_ADDRESS)
    localStorage.setItem(STORAGE_KEY, MOCK_ADDRESS)
    setConnecting(false)
  }, [])

  const disconnect = useCallback(() => {
    setAddress(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo<WalletContextValue>(
    () => ({ address, isConnected: !!address, connecting, connect, disconnect }),
    [address, connecting, connect, disconnect],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error("useWallet must be used within a WalletProvider")
  return ctx
}
