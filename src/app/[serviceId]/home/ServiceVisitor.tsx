"use client"

import { useEffect } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"

export default function ServiceVisitor({ serviceId }: { serviceId: string }) {
  const visitService = useConsoleStore((s) => s.visitService)
  useEffect(() => {
    visitService(serviceId)
  }, [serviceId, visitService])
  return null
}
