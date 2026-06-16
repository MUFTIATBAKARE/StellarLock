import type { ReactNode } from "react"
import { Wallet } from "lucide-react"
import { useWallet } from "@/hooks/useWallet"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"

/** Wraps content that requires a connected wallet. */
export function ConnectGate({ children, title }: { children: ReactNode; title?: string }) {
  const { isConnected, connect, connecting } = useWallet()

  if (isConnected) return <>{children}</>

  return (
    <Card className="mx-auto flex max-w-md flex-col items-center gap-4 p-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Wallet className="h-6 w-6" />
      </span>
      <div>
        <h2 className="text-lg font-semibold">{title ?? "Connect your wallet"}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect a Stellar wallet to continue.
        </p>
      </div>
      <Button onClick={connect} loading={connecting}>
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    </Card>
  )
}
