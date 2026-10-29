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
