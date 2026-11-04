import type { Metadata } from "next"
import { notFound } from "next/navigation"
import SettingsEdit from "@/components/settings/SettingsEdit"
import { sections } from "@/lib/settings"
import site from "@data/site.json"

interface Props {
  params: Promise<{ section: string }>
}

export function generateStaticParams() {
  return sections.map((s) => ({ section: s.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section: id } = await params
  const section = sections.find((s) => s.id === id)
  return section ? { title: site.detailTitles.settings.replace("%s", section.editTitle) } : {}
}

export default async function SettingsEditPage({ params }: Props) {
  const { section: id } = await params
  const section = sections.find((s) => s.id === id)
  if (!section) notFound()

  return <SettingsEdit section={section} />
}
