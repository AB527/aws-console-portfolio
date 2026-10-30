import github from "@/data/github.json"

export default function GitHubStatsWidget() {
  return (
    <div className="flex flex-col h-full -m-3">
      {/* Stats */}
      <div className="flex-1 px-4 pt-2">
        {github.stats.map((stat, i) => (
          <div
            key={stat.id}
            className={i > 0 ? "border-t border-gray-200 pt-4 mt-4" : ""}
          >
            <p className="text-[13px] text-gray-900 leading-tight">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-[24px] font-medium text-gray-900 leading-none">
                {stat.value}
              </span>
              <span className="text-[12px] font-medium text-gray-800 leading-none">
                {stat.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-4">
        <a
          href={github.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-[13px] font-medium text-[#0073bb] hover:underline py-3"
        >
          Go to GitHub
        </a>
      </div>
    </div>
  )
}
