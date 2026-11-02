"use client"

import Link from "next/link"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

function CategoryIcon({ color }: { color: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded-md shrink-0"
      style={{ backgroundColor: color }}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 1L11 3.5V8.5L6 11L1 8.5V3.5L6 1Z"
          stroke="white"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path d="M1 3.5L6 6L11 3.5M6 6V11" stroke="white" strokeWidth="1" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

interface ServiceLink {
  name: string
  link?: string
  note?: string
}

interface Category {
  name: string
  color: string
  services: ServiceLink[]
}

function ServiceEntry({ service }: { service: ServiceLink }) {
  return (
    <li className="leading-tight">
      {service.link ? (
        <Link href={service.link} className="text-[13px] text-[#0073bb] hover:underline">
          {service.name}
        </Link>
      ) : (
        <span className="text-[13px] text-[#0073bb] hover:underline cursor-pointer">
          {service.name}
        </span>
      )}
      {service.note && (
        <span className="block text-[12px] text-gray-500 leading-tight">{service.note}</span>
      )}
    </li>
  )
}

export default function AllServicesGrid() {
  const { data, error, reload } = useData("all-services")
  if (!data) return <DataStatus label="services" error={error} onRetry={reload} />
  const columns = data.columns as Category[][]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
      {columns.map((column, ci) => (
        <div key={ci} className="flex flex-col gap-7">
          {column.map((category) => (
            <div key={category.name} className="break-inside-avoid">
              <div className="flex items-center gap-2 mb-2.5">
                <CategoryIcon color={category.color} />
                <h3 className="text-[15px] font-bold text-gray-900">{category.name}</h3>
              </div>
              <ul className="flex flex-col gap-2 pl-0.5">
                {category.services.map((service) => (
                  <ServiceEntry key={service.name} service={service} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
