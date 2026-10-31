"use client"

interface ServiceIconProps {
  iconId: string
  color: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZE_MAP = {
  sm: { box: "w-6 h-6", text: "text-[9px]" },
  md: { box: "w-8 h-8", text: "text-xs" },
  lg: { box: "w-10 h-10", text: "text-sm" },
}

export default function ServiceIcon({ iconId, color, size = "md", className = "" }: ServiceIconProps) {
  const { box, text } = SIZE_MAP[size]
  return (
    <span className={`inline-flex items-center justify-center rounded-md shrink-0 overflow-hidden ${box} ${className}`}>
      <img
        src={`/icons/${iconId}.png`}
        alt={iconId}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement
          target.style.display = "none"
          const parent = target.parentElement
          if (parent) {
            parent.style.backgroundColor = color
            parent.style.display = "flex"
            parent.style.alignItems = "center"
            parent.style.justifyContent = "center"
            parent.innerHTML = `<span style="color:white;font-weight:bold;font-size:${size === 'sm' ? '9px' : size === 'md' ? '11px' : '13px'}">${iconId.slice(0,2).toUpperCase()}</span>`
          }
        }}
      />
    </span>
  )
}
