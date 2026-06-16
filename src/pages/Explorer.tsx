import { useParams, Link } from "react-router-dom"
import { Lock, Coins, CalendarClock, PieChart, ShieldCheck, ArrowLeft, ExternalLink, SearchX } from "lucide-react"
import { useLocksByToken } from "@/hooks/useLocks"
import { TokenAvatar } from "@/components/ui/TokenAvatar"
import { StatCard } from "@/components/ui/StatCard"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { TokenLockList } from "@/components/explorer/TokenLockList"
import { LockBadge } from "@/components/explorer/LockBadge"
import { TokenSearchBar } from "@/components/explorer/TokenSearchBar"
import { explorerLink } from "@/lib/stellar"
import { formatAmount, formatDate, formatUsd, shortAddress } from "@/lib/utils"

export function Explorer() {
  const { token } = useParams<{ token: string }>()
  const { data, loading, error } = useLocksByToken(token)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      {loading && <ExplorerSkeleton />}

      {!loading && (error || !data) && <NotFound query={token ?? ""} />}

      {!loading && data && (
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <TokenAvatar symbol={data.token.symbol} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{data.token.name}</h1>
                  <Badge variant="primary">{data.token.symbol}</Badge>
                </div>
                <a
                  href={explorerLink(data.token.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {shortAddress(data.token.address, 8, 8)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 px-4 py-3">
              <ShieldCheck className="h-5 w-5 text-success" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-success">Liquidity verified locked</p>
                <p className="text-xs text-muted-foreground">On-chain, immutable, public</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total locked"
              value={formatAmount(data.totalLocked, { compact: true })}
              hint={`${data.token.symbol} across all locks`}
              icon={<Coins className="h-4 w-4" />}
            />
            <StatCard
              label="Value secured"
              value={formatUsd(data.totalUsdValue)}
              hint="Approx. USD at lock time"
              icon={<Lock className="h-4 w-4" />}
            />
            <StatCard
              label="Active locks"
              value={data.activeLocks}
              hint="Currently enforced on-chain"
              icon={<ShieldCheck className="h-4 w-4" />}
            />
            <StatCard
              label="Next unlock"
              value={data.nextUnlockAt ? formatDate(data.nextUnlockAt) : "—"}
              hint={data.percentOfSupply ? `~${data.percentOfSupply}% of supply locked` : undefined}
              icon={data.percentOfSupply ? <PieChart className="h-4 w-4" /> : <CalendarClock className="h-4 w-4" />}
            />
          </div>

          {/* Shareable badge */}
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Share proof with your community</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Embed this badge in your README, website, or Telegram. Anyone can click through to this
              page and independently verify that liquidity is locked — no trust required.
            </p>
            <div className="mt-5">
              <LockBadge summary={data} />
            </div>
          </section>

          {/* Locks list */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">All locks ({data.locks.length})</h2>
            </div>
            <TokenLockList locks={data.locks} />
          </section>
        </div>
      )}
    </div>
  )
}

function ExplorerSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-28 animate-pulse rounded-2xl border border-border bg-card" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-card" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
    </div>
  )
}

function NotFound({ query }: { query: string }) {
  return (
    <div className="mx-auto max-w-xl py-12 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h1 className="text-xl font-semibold">No locks found</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        We couldn&apos;t find any locks for{" "}
        <span className="font-mono text-foreground">{shortAddress(query, 6, 6)}</span>. Double-check the
        token symbol or contract address, or create the first lock for this token.
      </p>
      <div className="mt-6">
        <TokenSearchBar />
      </div>
      <div className="mt-4">
        <Link to="/app/create">
          <Button variant="outline">Create a lock</Button>
        </Link>
      </div>
    </div>
  )
}
