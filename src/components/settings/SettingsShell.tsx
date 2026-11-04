import type { BreadcrumbItem } from "@/components/layout/Breadcrumb"
import ConsoleHomeShell from "@/components/home/ConsoleHomeShell"
import InfoLink from "@/components/ui/InfoLink"
import { openSans } from "@/lib/font"
import settings from "@data/settings.json"

interface SettingsShellProps {
  title: string
  description: string
  // Topic behind the "Info" link beside the title
  infoTopic?: string
  breadcrumb?: BreadcrumbItem[]
  children: React.ReactNode
}

// Frame shared by the Unified settings pages: console top bar, title, description
export default function SettingsShell({ title, description, infoTopic, breadcrumb, children }: SettingsShellProps) {
  return (
    <div className={`${openSans.className} min-h-screen bg-surface-subtle text-[14px] leading-5 text-ink`}>
      <ConsoleHomeShell breadcrumb={breadcrumb} helpTopic={settings.helpTopic}>
        <div className="max-w-[1520px] mx-auto px-4 lg:px-6 py-5">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h1 className="text-[24px] leading-[30px] font-bold">{title}</h1>
            {infoTopic && <InfoLink topic={infoTopic} />}
          </div>
          <p className="mt-1 text-ink-body">{description}</p>
          {children}
        </div>
      </ConsoleHomeShell>
    </div>
  )
}
