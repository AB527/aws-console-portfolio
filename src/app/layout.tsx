import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConsoleLayout from "@/components/layout/ConsoleLayout"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "Atharva Bedekar — AWS Console Portfolio",
  description: "Personal portfolio built as an AWS Management Console",
  icons: [{ url: "/icon.png", type: "image/png" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AB Console",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <ConsoleLayout>{children}</ConsoleLayout>
      </body>
    </html>
  )
}
