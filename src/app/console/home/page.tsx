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
import { openSans } from "@/lib/awsFont"

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
    <div className={`${openSans.className} min-h-screen bg-[#f9f9fa] text-[14px] leading-5 text-[#0f141a]`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 bg-white border-b border-[#c6c6cd] text-[#424650]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 11v6M12 7v.5" />
        </svg>
      </div>
      <ConsoleHomeHeader />
      <div className="px-4 lg:px-6 pb-8">
        <Suspense fallback={<div className="text-sm text-gray-500 py-4">Loading dashboard...</div>}>
          <DashboardGrid widgets={widgets} />
        </Suspense>
      </div>
    </div>
  )
}
