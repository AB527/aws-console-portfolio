import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConsoleLayout from "@/components/layout/ConsoleLayout"
import { themeScript } from "@/lib/theme"
import site from "@data/site.json"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: { default: site.titleDefault, template: site.titleTemplate },
  description: site.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.appTitle,
  },
}

export const viewport: Viewport = {
  themeColor: "#0f1620",
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans antialiased">
        <ConsoleLayout>{children}</ConsoleLayout>
      </body>
    </html>
  )
}
