"use client"

import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"
import { useConsoleStore } from "@/store/useConsoleStore"

export function useRegion(): ["ap-south-1" | "ap-south-17", (r: "ap-south-1" | "ap-south-17") => void] {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const storeRegion = useConsoleStore((s) => s.selectedRegion)
  const setStoreRegion = useConsoleStore((s) => s.setRegion)

  const paramRegion = searchParams.get("region") as "ap-south-1" | "ap-south-17" | null
  const region = (paramRegion === "ap-south-1" || paramRegion === "ap-south-17")
    ? paramRegion
    : storeRegion

  const setRegion = useCallback(
    (r: "ap-south-1" | "ap-south-17") => {
      setStoreRegion(r)
      const params = new URLSearchParams(searchParams.toString())
      params.set("region", r)
      router.replace(`${pathname}?${params.toString()}`)
    },
    [setStoreRegion, router, pathname, searchParams]
  )

  return [region, setRegion]
}
