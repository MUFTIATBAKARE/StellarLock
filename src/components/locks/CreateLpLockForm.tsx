import { useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Droplets, Info } from "lucide-react"
import type { Dex } from "@/types/lock"
import { Input, Label } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { cn, formatDate } from "@/lib/utils"
import { useWallet } from "@/hooks/useWallet"
import { createLpLock } from "@/lib/lp-locker"

const DAY = 86_400_000
const PRESETS = [
  { label: "90 days", days: 90 },
  { label: "6 months", days: 182 },
  { label: "1 year", days: 365 },
  { label: "2 years", days: 730 },
]

const DEXES: { value: Dex; label: string; desc: string }[] = [
  { value: "aquarius", label: "Aquarius", desc: "AMM & SDEX pools" },
  { value: "soroswap", label: "Soroswap", desc: "Soroban AMM" },
]

export function CreateLpLockForm() {
  const { address, signTransaction } = useWallet()
  const navigate = useNavigate()

  const [dex, setDex] = useState<Dex>("aquarius")
  const [poolShareAddress, setPoolShareAddress] = useState("")
  const [tokenA, setTokenA] = useState("")
  const [tokenB, setTokenB] = useState("")
  const [amount, setAmount] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const minDate = useMemo(() => new Date(Date.now() + DAY).toISOString().slice(0, 10), [])
  const unlockTs = unlockDate ? new Date(unlockDate).getTime() : 0
  const valid =
    poolShareAddress.trim().length > 4 &&
    tokenA.trim().length > 4 &&
    tokenB.trim().length > 4 &&
    Number(amount) > 0 &&
    unlockTs > Date.now()

  function applyPreset(days: number) {
    setUnlockDate(new Date(Date.now() + days * DAY).toISOString().slice(0, 10))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!valid) return
    setSubmitting(true)
    try {
      const { id } = await createLpLock(
        {
          poolShareAddress: poolShareAddress.trim(),
          dex,
          tokenA: tokenA.trim(),
          tokenB: tokenB.trim(),
          amount: Number(amount),
          beneficiary: address!,
          unlockAt: Math.floor(unlockTs / 1000),
        },
        address!,
        signTransaction,
      )
      navigate(`/app/lock/${id}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label>DEX</Label>
        <div className="grid grid-cols-2 gap-3">
          {DEXES.map((d) => (
            <button
              type="button"
              key={d.value}
              onClick={() => setDex(d.value)}
              className={cn(
                "flex flex-col items-start rounded-lg border p-3 text-left transition-colors cursor-pointer",
                dex === d.value
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background/40 hover:border-primary/40",
              )}
            >
              <span className="flex items-center gap-2 font-medium">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    d.value === "aquarius" ? "bg-primary" : "bg-warning",
                  )}
                />
                {d.label}
              </span>
              <span className="text-xs text-muted-foreground">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="pool">Pool share token address</Label>
        <Input
          id="pool"
          placeholder="C… (LP token contract)"
          value={poolShareAddress}
          onChange={(e) => setPoolShareAddress(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          The contract address of your {dex === "aquarius" ? "Aquarius" : "Soroswap"} pool share token.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="token-a">Token A address</Label>
          <Input
            id="token-a"
            placeholder="C…"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="token-b">Token B address</Label>
          <Input
            id="token-b"
            placeholder="C…"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lp-amount">LP amount to lock</Label>
        <Input
          id="lp-amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lp-unlock">Unlock date</Label>
        <Input
          id="lp-unlock"
          type="date"
          min={minDate}
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.days)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:border-primary/40 cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          Locking LP shares signals to traders that the liquidity floor is protected.
          {unlockTs > Date.now() && (
            <>
              {" "}
              Liquidity unlocks on{" "}
              <span className="font-medium text-foreground">{formatDate(unlockTs)}</span>.
            </>
          )}
        </span>
      </div>

      <Button type="submit" size="lg" loading={submitting} disabled={!valid}>
        <Droplets className="h-4 w-4" />
        Lock liquidity
      </Button>
    </form>
  )
}
