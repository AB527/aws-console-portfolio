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
        <h2 className="text-lg font-semibold text-gray-700 mb-1">{service.title}</h2>
        <p className="text-sm text-gray-500 mb-1">
          This service is not available in region{" "}
          <span className="font-medium text-gray-700">{region}</span>.
        </p>
        <p className="text-xs text-gray-400">
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
          <h1 className="text-xl font-semibold text-gray-900">{service.title}</h1>
          <p className="text-sm text-gray-500">{service.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-gray-200 shadow-sm p-6 text-center text-gray-400 text-sm">
        Content coming soon for {service.title}
      </div>
    </div>
  )
}
