import type { Metadata } from "next"
import { Suspense } from "react"
import EC2Dashboard from "@/components/services/ec2/EC2Dashboard"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.ec2 }

interface Props {
  searchParams: Promise<{ region?: string; view?: string; project?: string; type?: string }>
}

export default async function EC2Page({ searchParams }: Props) {
  const { view, project, type } = await searchParams
  return (
    <>
      <ServiceVisitor serviceId="ec2" />
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading...</div>}>
        <EC2Dashboard view={view ?? null} activeProject={project ?? null} activeType={type ?? null} />
      </Suspense>
    </>
  )
}
