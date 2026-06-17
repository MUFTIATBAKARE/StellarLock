import { useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Lock, Info } from "lucide-react"
import { Input, Label } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useWallet } from "@/hooks/useWallet"
import { createTokenLock } from "@/lib/token-locker"
import { formatDate } from "@/lib/utils"

const DAY = 86_400_000
const PRESETS = [
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "6 months", days: 182 },
  { label: "1 year", days: 365 },
]

export function CreateTokenLockForm() {
  const { address, signTransaction } = useWallet()
  const navigate = useNavigate()

  const [tokenAddress, setTokenAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [beneficiary, setBeneficiary] = useState("")
  const [unlockDate, setUnlockDate] = useState("")
  const [vesting, setVesting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const minDate = useMemo(() => new Date(Date.now() + DAY).toISOString().slice(0, 10), [])
  const unlockTs = unlockDate ? new Date(unlockDate).getTime() : 0
  const valid = tokenAddress.trim().length > 4 && Number(amount) > 0 && unlockTs > Date.now()

  function applyPreset(days: number) {
    setUnlockDate(new Date(Date.now() + days * DAY).toISOString().slice(0, 10))
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!valid) return
    setError(null)
    setSubmitting(true)
    try {
      const { id } = await createTokenLock(
        {
          tokenAddress: tokenAddress.trim(),
          amount: Number(amount),
          beneficiary: beneficiary.trim() || address!,
          unlockAt: Math.floor(unlockTs / 1000),
          vesting: vesting
            ? { start: Math.floor(Date.now() / 1000), end: Math.floor(unlockTs / 1000) }
            : undefined,
        },
        address!,
        signTransaction,
      )
      navigate(`/app/lock/${id}`)
    } catch (err: unknown) {
      console.error("[createLock error]", err)
      if (err instanceof Error) {
        setError(err.message)
      } else if (typeof err === "object" && err !== null) {
        setError(JSON.stringify(err, null, 2))
      } else {
        setError(String(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="token">Token contract address</Label>
        <Input
          id="token"
          placeholder="C… (Soroban token contract)"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          The Soroban contract address of the token you want to lock.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="amount">Amount to lock</Label>
        <Input
          id="amount"
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
        <Label htmlFor="beneficiary">Beneficiary (optional)</Label>
        <Input
          id="beneficiary"
          placeholder={address ?? "G…"}
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Who can withdraw once unlocked. Defaults to your address.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="unlock">Unlock date</Label>
        <Input
          id="unlock"
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

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background/40 p-3">
        <input
          type="checkbox"
          checked={vesting}
          onChange={(e) => setVesting(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[oklch(0.78_0.16_175)]"
        />
        <span className="text-sm">
          <span className="font-medium">Linear vesting</span>
          <span className="block text-muted-foreground">
            Release gradually from now until the unlock date, instead of all at once.
          </span>
        </span>
      </label>

      <div className="flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <span>
          Locks are immutable: you can extend the unlock date later, but never shorten it.
          {unlockTs > Date.now() && (
            <>
              {" "}Funds unlock on{" "}
              <span className="font-medium text-foreground">{formatDate(unlockTs)}</span>.
            </>
          )}
        </span>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" size="lg" loading={submitting} disabled={!valid}>
        <Lock className="h-4 w-4" />
        Lock tokens
      </Button>
    </form>
  )
}
