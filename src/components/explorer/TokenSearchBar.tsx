import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { TOKENS, findToken } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function TokenSearchBar({ className, autoFocus }: { className?: string; autoFocus?: boolean }) {
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  function submit(e: FormEvent) {
    e.preventDefault()
    const value = query.trim()
    if (!value) return
    // Accept either a contract address or a known symbol.
    const match = findToken(value)
    navigate(`/explore/${match ? match.address : value}`)
  }

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={submit}
        className="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-lg shadow-black/20 focus-within:border-primary/50"
      >
        <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus={autoFocus}
          placeholder="Search a token by symbol or contract address…"
          aria-label="Search token to verify locks"
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button type="submit" size="md" className="shrink-0">
          Verify locks
        </Button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>Try:</span>
        {Object.values(TOKENS)
          .slice(0, 3)
          .map((t) => (
            <button
              key={t.symbol}
              onClick={() => navigate(`/explore/${t.address}`)}
              className="rounded-full border border-border bg-secondary px-2.5 py-1 font-medium text-foreground transition-colors hover:border-primary/40 cursor-pointer"
            >
              {t.symbol}
            </button>
          ))}
      </div>
    </div>
  )
}
