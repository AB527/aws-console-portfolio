interface PolicyTagProps {
  name: string
  className?: string
}

export default function PolicyTag({ name, className = "" }: PolicyTagProps) {
  return (
    <code
      className={`inline-block bg-gray-100 dark:bg-surface-subtle text-gray-700 dark:text-ink-body text-xs font-mono px-2 py-0.5 rounded-full border border-gray-200 dark:border-line ${className}`}
    >
      {name}
    </code>
  )
}
