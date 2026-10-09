interface PolicyTagProps {
  name: string
  className?: string
}

export default function PolicyTag({ name, className = "" }: PolicyTagProps) {
  return (
    <code
      className={`inline-block bg-gray-100 text-gray-700 text-xs font-mono px-2 py-0.5 rounded border border-gray-200 ${className}`}
    >
      {name}
    </code>
  )
}
