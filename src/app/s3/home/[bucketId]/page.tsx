import { notFound } from "next/navigation"
import s3Data from "@/data/s3.json"
import BucketDetail from "@/components/services/s3/BucketDetail"

interface Props {
  params: Promise<{ bucketId: string }>
}

export default async function BucketPage({ params }: Props) {
  const { bucketId } = await params
  const bucket = s3Data.buckets.find((b) => b.id === bucketId)
  if (!bucket) notFound()

  return (
    <div className="p-6">
      <BucketDetail bucket={bucket} />
    </div>
  )
}
