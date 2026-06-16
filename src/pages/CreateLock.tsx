import { useState } from "react"
import { Coins, Droplets } from "lucide-react"
import { ConnectGate } from "@/components/layout/ConnectGate"
import { Card } from "@/components/ui/Card"
import { CreateTokenLockForm } from "@/components/locks/CreateTokenLockForm"
import { CreateLpLockForm } from "@/components/locks/CreateLpLockForm"
import { cn } from "@/lib/utils"

type Tab = "token" | "lp"

export function CreateLock() {
  const [tab, setTab] = useState<Tab>("token")

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create a lock</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lock tokens or LP positions in an immutable Soroban contract.
        </p>
      </div>

      <ConnectGate title="Connect to create a lock">
        <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1">
          <TabButton active={tab === "token"} onClick={() => setTab("token")} icon={<Coins className="h-4 w-4" />}>
            Token Lock
          </TabButton>
          <TabButton active={tab === "lp"} onClick={() => setTab("lp")} icon={<Droplets className="h-4 w-4" />}>
            LP Lock
          </TabButton>
        </div>

        <Card className="p-6">
          {tab === "token" ? <CreateTokenLockForm /> : <CreateLpLockForm />}
        </Card>
      </ConnectGate>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {children}
    </button>
  )
}
