"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import dashboardLayout from "@data/dashboard-layout.json"
import { STORE_KEY, type VisualMode } from "@/lib/theme"

type RegionId = "ap-south-1" | "ap-south-17"

// Everything the Unified settings pages can change (see public/data/settings.json)
export interface ConsoleSettings {
  language: "browser-default"
  selectedRegion: RegionId
  visualMode: VisualMode
  favoritesBarDisplay: "name-icon" | "icon"
  favoritesBarIconSize: "small" | "large"
  rememberRecentlyVisited: boolean
  qHelpLinks: boolean
  // Account settings: ids left out of the Region menu and the service lists
  hiddenRegions: string[]
  hiddenServices: string[]
}

const USER_SETTING_DEFAULTS = {
  language: "browser-default",
  selectedRegion: "ap-south-1",
  visualMode: "browser-default",
  favoritesBarDisplay: "name-icon",
  favoritesBarIconSize: "large",
  rememberRecentlyVisited: true,
  qHelpLinks: true,
} satisfies Partial<ConsoleSettings>

export interface WidgetLayout {
  id: string
  colSpan: number
  rowSpan: number
  order: number
  visible: boolean
}

interface ConsoleStore extends ConsoleSettings {
  recentlyVisited: string[]
  widgetLayout: WidgetLayout[]
  activeBucket: string | null
  hiddenWidgets: string[]
  cloudShellOpen: boolean
  notificationsRead: boolean
  mobileNavOpen: boolean
  amazonQOpen: boolean
  favorites: string[]
  addWidgetsOpen: boolean
  sidebarCollapsed: boolean
  // Topic shown in the help panel: "console-home" or a widget id
  helpTopic: string | null
  setHelpTopic: (topic: string | null) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleFavorite: (id: string) => void
  addWidget: (id: string, beforeId?: string) => void
  setAddWidgetsOpen: (open: boolean) => void
  setAmazonQOpen: (open: boolean) => void
  setMobileNavOpen: (open: boolean) => void
  setRegion: (r: RegionId) => void
  applySettings: (patch: Partial<ConsoleSettings>) => void
  resetUserSettings: () => void
  visitService: (id: string) => void
  setWidgetLayout: (layout: WidgetLayout[]) => void
  resizeWidget: (id: string, colSpan: number, rowSpan: number) => void
  setActiveBucket: (id: string | null) => void
  setVisualMode: (m: VisualMode) => void
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
    visible: w.defaultVisible,
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
      ...USER_SETTING_DEFAULTS,
      hiddenRegions: [],
      hiddenServices: [],
      recentlyVisited: [],
      widgetLayout: getDefaultLayout(),
      activeBucket: null,
      hiddenWidgets: [],
      cloudShellOpen: false,
      notificationsRead: false,
      mobileNavOpen: false,
      amazonQOpen: false,
      favorites: [],
      addWidgetsOpen: false,
      sidebarCollapsed: false,
      helpTopic: null,

      // The help panel and Add widgets share the right-hand slot, so opening one closes the other
      setHelpTopic: (topic) => set(topic ? { helpTopic: topic, addWidgetsOpen: false } : { helpTopic: null }),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((x) => x !== id)
            : [...state.favorites, id],
        })),

      // Shows a hidden widget, placed before `beforeId` or at the end
      addWidget: (id, beforeId) =>
        set((state) => {
          if (state.widgetLayout.some((w) => w.id === id && w.visible)) return state
          const ordered = state.widgetLayout
            .filter((w) => w.visible)
            .sort((a, b) => a.order - b.order)
            .map((w) => w.id)
          const at = beforeId ? ordered.indexOf(beforeId) : -1
          ordered.splice(at === -1 ? ordered.length : at, 0, id)
          return {
            hiddenWidgets: state.hiddenWidgets.filter((x) => x !== id),
            widgetLayout: state.widgetLayout.map((w) => {
              const order = ordered.indexOf(w.id)
              return order === -1 ? w : { ...w, visible: true, order }
            }),
          }
        }),

      setAddWidgetsOpen: (open) => set(open ? { addWidgetsOpen: true, helpTopic: null } : { addWidgetsOpen: false }),

      setAmazonQOpen: (open) => set({ amazonQOpen: open }),

      setMobileNavOpen: (open) => set({ mobileNavOpen: open }),

      setRegion: (r) => set({ selectedRegion: r }),

      // Turning off "remember recently visited" also clears what was remembered
      applySettings: (patch) =>
        set((state) => ({
          ...patch,
          recentlyVisited: patch.rememberRecentlyVisited === false ? [] : state.recentlyVisited,
        })),

      // Only the user settings: hidden Regions and services belong to the account tab
      resetUserSettings: () =>
        set((state) => ({
          ...USER_SETTING_DEFAULTS,
          // The default Region may have been hidden on the account tab
          selectedRegion: state.hiddenRegions.includes(USER_SETTING_DEFAULTS.selectedRegion)
            ? state.selectedRegion
            : USER_SETTING_DEFAULTS.selectedRegion,
        })),

      visitService: (id) =>
        set((state) => {
          if (!state.rememberRecentlyVisited) return state
          const filtered = state.recentlyVisited.filter((x) => x !== id)
          return { recentlyVisited: [id, ...filtered].slice(0, 8) }
        }),

      setWidgetLayout: (layout) => set({ widgetLayout: layout }),

      // Called on every pointer move of a resize, so an unchanged size leaves the state alone
      resizeWidget: (id, colSpan, rowSpan) =>
        set((state) => {
          const current = state.widgetLayout.find((w) => w.id === id)
          if (!current) return state
          const next = clampToConfig({ ...current, colSpan, rowSpan })
          if (next.colSpan === current.colSpan && next.rowSpan === current.rowSpan) return state
          return { widgetLayout: state.widgetLayout.map((w) => (w.id === id ? next : w)) }
        }),

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
      name: STORE_KEY,
      // v1 halved the dashboard row height, so a saved widget covers twice as many rows
      version: 1,
      migrate: (persisted, version) => {
        const p = (persisted ?? {}) as ConsoleStore
        if (version >= 1 || !p.widgetLayout) return p
        return { ...p, widgetLayout: p.widgetLayout.map((w) => ({ ...w, rowSpan: w.rowSpan * 2 })) }
      },
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
        language: state.language,
        favoritesBarDisplay: state.favoritesBarDisplay,
        favoritesBarIconSize: state.favoritesBarIconSize,
        rememberRecentlyVisited: state.rememberRecentlyVisited,
        qHelpLinks: state.qHelpLinks,
        hiddenRegions: state.hiddenRegions,
        hiddenServices: state.hiddenServices,
        hiddenWidgets: state.hiddenWidgets,
        notificationsRead: state.notificationsRead,
        favorites: state.favorites,
      }),
    }
  )
)
