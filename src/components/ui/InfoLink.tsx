"use client"

import help from "@data/help.json"
import { useConsoleStore } from "@/store/useConsoleStore"

interface InfoLinkProps {
  // Key of the topic in help.json
  topic: string
  className?: string
  // Render a span instead of a button, for use inside another button
  inline?: boolean
}

// The small "Info" link beside a heading. Opens the help panel on its topic.
export default function InfoLink({
  topic,
  className = "text-xs font-bold text-link hover:underline",
  inline = false,
}: InfoLinkProps) {
  const setHelpTopic = useConsoleStore((s) => s.setHelpTopic)

  function open(e: React.SyntheticEvent) {
    e.stopPropagation()
    setHelpTopic(topic)
  }

  if (inline) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter") open(e)
        }}
        className={`cursor-pointer ${className}`}
      >
        {help.labels.info}
      </span>
    )
  }

  return (
    <button type="button" onClick={open} className={`cursor-pointer ${className}`}>
      {help.labels.info}
    </button>
  )
}
