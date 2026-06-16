import { Link, Outlet } from "react-router-dom"
import { Lock } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Lock className="h-3 w-3" />
          </span>
          <span className="font-medium text-foreground">StellarLock</span>
          <span>— Token & LP locks on Stellar</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app/create" className="hover:text-foreground">
            Create Lock
          </Link>
          <Link to="/app/locks" className="hover:text-foreground">
            My Locks
          </Link>
          <span className="rounded-md border border-border px-2 py-0.5 text-xs">Testnet</span>
        </div>
      </div>
    </footer>
  )
}
