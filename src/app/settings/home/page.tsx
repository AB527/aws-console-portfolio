import type { Metadata } from "next"
import SettingsHome from "@/components/settings/SettingsHome"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.settings }

export default function SettingsPage() {
  return <SettingsHome tab="user" />
}
