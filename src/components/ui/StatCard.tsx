import type { ReactNode } from "react"
import { Card } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon,
  hint,
  className,
}: {
  label: string
  value: ReactNode
  icon?: ReactNode
  hint?: ReactNode
  className?: string
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  )
}
