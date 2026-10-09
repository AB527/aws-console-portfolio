import StatusBadge from "@/components/ui/StatusBadge"
import exploreData from "@/data/explore.json"

export default function ExploreWidget() {
  return (
    <div className="flex flex-col gap-0">
      <h3 className="text-[14px] font-bold text-gray-800 mb-2">{exploreData.heading}</h3>
      {exploreData.items.map((item, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-2 py-2 border-b border-gray-100 last:border-0"
        >
          <span className="text-[13px] font-semibold text-gray-800 flex-1 min-w-0 truncate">{item.title}</span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{item.reward}</span>
            <StatusBadge status={item.status} />
          </div>
        </div>
      ))}
    </div>
  )
}
