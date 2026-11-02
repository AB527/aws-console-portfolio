"use client"

import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"

export default function GitHubStatsWidget() {
  const { data: github, error, reload } = useData("github")
  if (!github) return <DataStatus label="GitHub stats" error={error} onRetry={reload} />

  return (
    <div className="flex flex-col h-full -mx-5 -mb-5">
      {/* Stats */}
      <div className="flex-1 px-5 pt-2">
        {github.stats.map((stat, i) => (
          <div
            key={stat.id}
            className={i > 0 ? "border-t border-[#c6c6cd] pt-3 mt-3" : ""}
          >
            <p className="text-[#0f141a]">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-[28px] text-[#0f141a] leading-8">
                {stat.value}
              </span>
              <span className="text-[#0f141a] pb-1">
                {stat.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[#c6c6cd] mt-4">
        <a
          href={github.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[14px] text-[#006ce0] hover:underline py-3"
        >
          Go to GitHub
        </a>
      </div>
    </div>
  )
}
