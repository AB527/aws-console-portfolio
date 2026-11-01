"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import dashboardLayout from "@/data/dashboard-layout.json"

export interface WidgetLayout {
  id: string
  colSpan: number
  rowSpan: number
  order: number
  visible: boolean
}

interface ConsoleStore {
  selectedRegion: "ap-south-1" | "ap-south-17"
  recentlyVisited: string[]
  widgetLayout: WidgetLayout[]
  activeBucket: string | null
  visualMode: "browser-default" | "light"
  hiddenWidgets: string[]
  cloudShellOpen: boolean
  notificationsRead: boolean
  mobileNavOpen: boolean
  amazonQOpen: boolean
  setAmazonQOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
  setRegion: (r: "ap-south-1" | "ap-south-17") => void
  visitService: (id: string) => void
  setWidgetLayout: (layout: WidgetLayout[]) => void
  setActiveBucket: (id: string | null) => void
  setVisualMode: (m: "browser-default" | "light") => void
  removeWidget: (id: string) => void
  resetLayout: () => void
  setCloudShellOpen: (open: boolean) => void
  markNotificationsRead: () => void
}

function getDefaultLayout(): WidgetLayout[] {
  return dashboardLayout.widgets.map((w, i) => ({
    id: w.id,
    colSpan: w.defaultColSpan,
    rowSpan: w.defaultRowSpan,
    order: i,
    visible: true,
  }))
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

function clampToConfig(w: WidgetLayout): WidgetLayout {
  const config = dashboardLayout.widgets.find((c) => c.id === w.id)
  if (!config) return w
  return {
    ...w,
    colSpan: clamp(w.colSpan, config.minColSpan, config.maxColSpan),
    rowSpan: clamp(w.rowSpan, config.minRowSpan, config.maxRowSpan),
  }
}

export const useConsoleStore = create<ConsoleStore>()(
  persist(
    (set) => ({
      selectedRegion: "ap-south-1",
      recentlyVisited: [],
      widgetLayout: getDefaultLayout(),
      activeBucket: null,
      visualMode: "browser-default",
      hiddenWidgets: [],
      cloudShellOpen: false,
      notificationsRead: false,
      mobileNavOpen: false,
      amazonQOpen: false,

      setAmazonQOpen: (open) => set({ amazonQOpen: open }),

      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

      setRegion: (r) => set({ selectedRegion: r }),

      visitService: (id) =>
        set((state) => {
          const filtered = state.recentlyVisited.filter((x) => x !== id)
          return { recentlyVisited: [id, ...filtered].slice(0, 8) }
        }),

      setWidgetLayout: (layout) => set({ widgetLayout: layout }),

      setActiveBucket: (id) => set({ activeBucket: id }),

      setVisualMode: (m) => set({ visualMode: m }),

      removeWidget: (id) =>
        set((state) => ({
          hiddenWidgets: [...state.hiddenWidgets, id],
          widgetLayout: state.widgetLayout.map((w) =>
            w.id === id ? { ...w, visible: false } : w
          ),
        })),

      resetLayout: () =>
        set({ widgetLayout: getDefaultLayout(), hiddenWidgets: [] }),

      setCloudShellOpen: (open) => set({ cloudShellOpen: open }),

      markNotificationsRead: () => set({ notificationsRead: true }),
    }),
    {
      name: "aws-console-state",
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<ConsoleStore>
        const defaults = getDefaultLayout()
        const defaultIds = new Set(defaults.map((d) => d.id))

        // Keep the user's arrangement, but drop widgets that no longer exist
        // and append any newly added default widgets at the end.
        const kept = (p.widgetLayout ?? [])
          .filter((w) => defaultIds.has(w.id))
          .map(clampToConfig)
        const existingIds = new Set(kept.map((w) => w.id))
        let nextOrder = kept.reduce((m, w) => Math.max(m, w.order), -1) + 1
        const merged = [...kept]
        for (const d of defaults) {
          if (!existingIds.has(d.id)) merged.push({ ...d, order: nextOrder++ })
        }

        return { ...current, ...p, widgetLayout: merged }
      },
      partialize: (state) => ({
        selectedRegion: state.selectedRegion,
        recentlyVisited: state.recentlyVisited,
        widgetLayout: state.widgetLayout,
        activeBucket: state.activeBucket,
        visualMode: state.visualMode,
        hiddenWidgets: state.hiddenWidgets,
        notificationsRead: state.notificationsRead,
      }),
    }
  )
)
