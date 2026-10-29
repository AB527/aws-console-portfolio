import { Suspense } from "react"
import ConsoleHomeHeader from "@/components/home/ConsoleHomeHeader"
import DashboardGrid from "@/components/home/DashboardGrid"
import RecentlyVisitedWidget from "@/components/home/RecentlyVisitedWidget"
import KnowMeWidget from "@/components/home/KnowMeWidget"
import SystemStatusWidget from "@/components/home/SystemStatusWidget"
import AchievementsWidget from "@/components/home/AchievementsWidget"
import SolutionsWidget from "@/components/home/SolutionsWidget"
import ExploreWidget from "@/components/home/ExploreWidget"

const widgets: Record<string, React.ReactNode> = {
  "recently-visited": <RecentlyVisitedWidget />,
  "know-me": <KnowMeWidget />,
  "system-status": <SystemStatusWidget />,
  "achievements": <AchievementsWidget />,
  "solutions": <SolutionsWidget />,
  "explore": <ExploreWidget />,
}

export default function ConsolePage() {
  return (
    <div className="min-h-screen bg-[#f2f3f3]">
      <ConsoleHomeHeader />
      <div className="px-6 pb-8">
        <Suspense fallback={<div className="text-sm text-gray-500 py-4">Loading dashboard...</div>}>
          <DashboardGrid widgets={widgets} />
        </Suspense>
      </div>
    </div>
  )
}
