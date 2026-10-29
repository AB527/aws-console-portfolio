import { Suspense } from "react"
import EC2Dashboard from "@/components/services/ec2/EC2Dashboard"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"

interface Props {
  searchParams: Promise<{ region?: string; view?: string; project?: string }>
}

export default async function EC2Page({ searchParams }: Props) {
  const { view, project } = await searchParams
  return (
    <>
      <ServiceVisitor serviceId="ec2" />
      <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading...</div>}>
        <EC2Dashboard view={view ?? null} activeProject={project ?? null} />
      </Suspense>
    </>
  )
}
