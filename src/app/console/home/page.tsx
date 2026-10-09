import type { Metadata } from "next"
import { Suspense } from "react"
import ConsoleHomeHeader from "@/components/home/ConsoleHomeHeader"
import DashboardGrid from "@/components/home/DashboardGrid"
import RecentlyVisitedWidget from "@/components/home/RecentlyVisitedWidget"
import KnowMeWidget from "@/components/home/KnowMeWidget"
import GitHubStatsWidget from "@/components/home/GitHubStatsWidget"
import AchievementsWidget from "@/components/home/AchievementsWidget"
import SolutionsWidget from "@/components/home/SolutionsWidget"
import NewsListWidget from "@/components/home/NewsListWidget"
import announcements from "@/data/announcements.json"
import blogPosts from "@/data/blog-posts.json"
import site from "@/data/site.json"

export const metadata: Metadata = { title: site.pageTitles.consoleHome }

const widgets: Record<string, React.ReactNode> = {
  "recently-visited": <RecentlyVisitedWidget />,
  "know-me": <KnowMeWidget />,
  "system-status": <GitHubStatsWidget />,
  "achievements": <AchievementsWidget />,
  "solutions": <SolutionsWidget />,
  "announcements": <NewsListWidget items={announcements.items} footer={announcements.footer} />,
  "blog-posts": <NewsListWidget items={blogPosts.items} footer={blogPosts.footer} />,
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
