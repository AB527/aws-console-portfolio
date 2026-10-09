import Link from "next/link"
import knowMe from "@/data/know-me.json"

export default function KnowMeWidget() {
  return (
    <div className="flex flex-col gap-1">
      {knowMe.items.map((item) => {
        const content = (
          <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
            <img
              src={`/icons/${item.icon}.svg`}
              alt={item.icon}
              className="w-7 h-7 rounded-md shrink-0 mt-0.5"
            />
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#0073bb] group-hover:underline leading-tight">
                {item.label}
              </p>
              <p className="text-[12px] font-medium text-gray-500 mt-0.5 leading-snug">{item.description}</p>
            </div>
          </div>
        )

        if ("route" in item && item.route) {
          return <Link key={item.id} href={item.route}>{content}</Link>
        }
        if ("link" in item && item.link) {
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
