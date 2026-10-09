import StatusBadge from "@/components/ui/StatusBadge"
import exploreData from "@/data/explore.json"

export default function AchievementsWidget() {
  return (
    <div className="flex flex-col gap-1">
      {exploreData.items.map((item, i) => (
        <div key={i} className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0">
          <span className="text-[13px] font-semibold text-gray-800 flex-1 min-w-0 truncate">{item.title}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-medium text-gray-500">{item.reward}</span>
            <StatusBadge status={item.status} />
          </div>
        </div>
      ))}
    </div>
  )
}
