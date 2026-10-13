"use client"

import Link from "next/link"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

interface ServiceLink {
  name: string
  link?: string
}

interface Category {
  name: string
  // File name of the category icon in public/icons, without ".svg"
  icon: string
  services: ServiceLink[]
}

function CategoryBlock({ category }: { category: Category }) {
  return (
    <section>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/icons/${category.icon}.svg`} alt="" width={24} height={24} className="shrink-0" />
        <h3 className="text-[18px] leading-[22px] font-bold">{category.name}</h3>
      </div>
      {/* Indented to line up under the category name */}
      <ul className="mt-3 pl-9">
        {category.services.map((service) => (
          <li key={service.name}>
            {service.link ? (
              <Link href={service.link} className="text-link hover:underline">
                {service.name}
              </Link>
            ) : (
              <span className="text-ink-body">{service.name}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function AllServicesGrid() {
  const { data, error, reload } = useData("all-services")

  return (
    <div className="bg-surface rounded-2xl border border-line px-5 pt-4 pb-6">
      <h2 className="text-[20px] leading-6 font-bold">{data?.heading ?? " "}</h2>
      {data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 mt-5">
          {(data.columns as Category[][]).map((column, i) => (
            <div key={i} className="flex flex-col gap-6">
              {column.map((category) => (
                <CategoryBlock key={category.name} category={category} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <DataStatus label="services" error={error} onRetry={reload} />
      )}
    </div>
  )
}
