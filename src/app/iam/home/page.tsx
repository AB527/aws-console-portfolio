import IAMHome from "@/components/services/iam/IAMHome"
import ServiceVisitor from "@/app/[serviceId]/home/ServiceVisitor"

export default async function IAMHomePage() {
  return (
    <>
      <ServiceVisitor serviceId="iam" />
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900">IAM — Skills</h1>
          <p className="text-sm text-gray-500 mt-1">Technical skill groups and experience roles</p>
        </div>
        <IAMHome />
      </div>
    </>
  )
}
