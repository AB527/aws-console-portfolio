import type { Metadata } from "next"
import { Suspense } from "react"
import ConsoleHomeHeader from "@/components/home/ConsoleHomeHeader"
import ConsoleHomeShell from "@/components/home/ConsoleHomeShell"
import DashboardGrid from "@/components/home/DashboardGrid"
import RecentlyVisitedWidget from "@/components/home/RecentlyVisitedWidget"
import FavouritesWidget from "@/components/home/FavouritesWidget"
import KnowMeWidget from "@/components/home/KnowMeWidget"
import GitHubStatsWidget from "@/components/home/GitHubStatsWidget"
import AchievementsWidget from "@/components/home/AchievementsWidget"
import SolutionsWidget from "@/components/home/SolutionsWidget"
import NewsListWidget from "@/components/home/NewsListWidget"
import site from "@data/site.json"
import { openSans } from "@/lib/font"

export const metadata: Metadata = { title: site.pageTitles.consoleHome }

const widgets: Record<string, React.ReactNode> = {
  "recently-visited": <RecentlyVisitedWidget />,
  "favourites": <FavouritesWidget />,
  "know-me": <KnowMeWidget />,
  "system-status": <GitHubStatsWidget />,
  "achievements": <AchievementsWidget />,
  "solutions": <SolutionsWidget />,
  "announcements": <NewsListWidget source="announcements" label="announcements" />,
  "blog-posts": <NewsListWidget source="blog-posts" label="blog posts" />,
}

export default function ConsolePage() {
  return (
    <div className={`${openSans.className} min-h-screen bg-surface-subtle text-[14px] leading-5 text-ink`}>
      <ConsoleHomeShell>
        <Suspense fallback={<div className="text-sm text-gray-500 dark:text-ink-muted px-4 lg:px-6 py-4">Loading dashboard...</div>}>
          <DashboardGrid widgets={widgets} header={<ConsoleHomeHeader />} />
        </Suspense>
      </ConsoleHomeShell>
    </div>
  )
}
