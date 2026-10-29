import React from "react"

interface BadgeProps {
  children: React.ReactNode
  color?: string
  variant?: "filled" | "outline"
  className?: string
}

export default function Badge({ children, color, variant = "filled", className = "" }: BadgeProps) {
  const style: React.CSSProperties =
    variant === "filled"
      ? { backgroundColor: color ?? "#e5e7eb", color: color ? "#fff" : "#374151" }
      : { borderColor: color ?? "#9ca3af", color: color ?? "#374151", border: "1px solid" }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
      style={style}
    >
      {children}
    </span>
  )
}
