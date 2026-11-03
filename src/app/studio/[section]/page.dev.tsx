import { notFound } from "next/navigation"
import SectionView from "@/components/studio/SectionView"
import { findSection } from "@/components/studio/sections"
import { loadLookups, readDataFile } from "@/lib/studio"

interface Props {
  params: Promise<{ section: string }>
}

export default async function StudioSectionPage({ params }: Props) {
  const { section: id } = await params
  const section = findSection(id)
  if (!section) notFound()

  const [data, lookups] = await Promise.all([readDataFile(section.file), loadLookups()])
  if (data === undefined) notFound()

  return <SectionView key={id} sectionId={id} initial={data} lookups={lookups} />
}
