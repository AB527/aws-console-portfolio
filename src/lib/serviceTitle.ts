import services from "@/data/services.json"

export function serviceTitle(id: string): string {
  return services.find((s) => s.id === id)?.title ?? id
}
