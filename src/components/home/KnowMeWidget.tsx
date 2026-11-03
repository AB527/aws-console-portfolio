"use client"

import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

export default function KnowMeWidget() {
  const { data: knowMe, error, reload } = useData("know-me")
  if (!knowMe) return <DataStatus label="profile" error={error} onRetry={reload} />

  return (
    <div className="flex flex-col divide-y divide-[#c6c6cd]">
      {knowMe.items.map((item) => {
        const content = (
          <div className="flex items-center gap-4 py-3 group/item cursor-pointer">
            <img
              src={`/icons/${item.icon}.svg`}
              alt={item.icon}
              className="w-10 h-10 rounded-md shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[16px] leading-5 font-bold text-[#006ce0] group-hover/item:underline">
                {item.label}
              </p>
              <p className="text-[#0f141a] mt-1">{item.description}</p>
            </div>
          </div>
        )

        if (item.link) {
          return (
            <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          )
        }
        return <div key={item.id}>{content}</div>
      })}
    </div>
  )
}
