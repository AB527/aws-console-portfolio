import Badge from "./Badge"

type StatusValue =
  | "Active"
  | "Inactive"
  | "running"
  | "stopped"
  | "in-progress"
  | "completed"
  | "Advanced"
  | "Intermediate"
  | "Beginner"
  | "Allow"
  | "Deny"

interface StatusBadgeProps {
  status: string
  className?: string
}

const STATUS_CONFIG: Record<StatusValue, { color: string; label?: string }> = {
  Active: { color: "#1a7f37" },
  running: { color: "#1a7f37", label: "Running" },
  completed: { color: "#1a7f37", label: "Completed" },
  Allow: { color: "#1a7f37" },
  Advanced: { color: "#1a7f37" },
  Inactive: { color: "#6b7280" },
  stopped: { color: "#6b7280", label: "Stopped" },
  Beginner: { color: "#6b7280" },
  "in-progress": { color: "#0073bb", label: "In Progress" },
  Intermediate: { color: "#0073bb" },
  Deny: { color: "#b91c1c" },
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as StatusValue]
  const color = config?.color ?? "#6b7280"
  const label = config?.label ?? status

  return (
    <Badge color={color} className={className}>
      {label}
    </Badge>
  )
}
