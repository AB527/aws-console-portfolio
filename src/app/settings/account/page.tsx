import type { Metadata } from "next"
import SettingsHome from "@/components/settings/SettingsHome"
import site from "@data/site.json"

export const metadata: Metadata = { title: site.pageTitles.settingsAccount }

export default function AccountSettingsPage() {
  return <SettingsHome tab="account" />
}
