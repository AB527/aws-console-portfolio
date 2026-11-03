import ServiceIcon from "@/components/ui/ServiceIcon"

interface Service {
  id: string
  title: string
  description: string
  iconId: string
  global: boolean
  regions: string[]
  color: string
}

interface GenericServicePageProps {
  service: Service
  region: string
}

export default function GenericServicePage({ service, region }: GenericServicePageProps) {
  const available = service.global || service.regions.includes(region)

  if (!available) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ServiceIcon iconId={service.iconId} color={service.color} size="lg" className="mb-4 opacity-40" />
        <h2 className="text-lg font-semibold text-gray-700 dark:text-ink-body mb-1">{service.title}</h2>
        <p className="text-sm text-gray-500 dark:text-ink-muted mb-1">
          This service is not available in region{" "}
          <span className="font-medium text-gray-700 dark:text-ink-body">{region}</span>.
        </p>
        <p className="text-xs text-gray-400 dark:text-ink-muted">
          Available in: {service.regions.join(", ") || "N/A"}
        </p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <ServiceIcon iconId={service.iconId} color={service.color} size="md" />
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-ink">{service.title}</h1>
          <p className="text-sm text-gray-500 dark:text-ink-muted">{service.description}</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-gray-200 dark:border-line shadow-sm p-6 text-center text-gray-400 dark:text-ink-muted text-sm">
        Content coming soon for {service.title}
      </div>
    </div>
  )
}
