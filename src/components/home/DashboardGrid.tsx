"use client"

import { useState, useRef, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useConsoleStore, WidgetLayout } from "@/store/useConsoleStore"
import dashboardLayout from "@/data/dashboard-layout.json"
import WidgetInfoPanel from "./WidgetInfoPanel"

interface WidgetConfig {
  id: string
  minColSpan: number
  maxColSpan: number
}

const WIDGET_CONFIGS: Record<string, WidgetConfig> = {}
for (const w of dashboardLayout.widgets) {
  WIDGET_CONFIGS[w.id] = { id: w.id, minColSpan: w.minColSpan, maxColSpan: w.maxColSpan }
}

const WIDGET_TITLES: Record<string, string> = {
  "recently-visited": "Recently visited",
  "pinned": "Pinned",
  "know-me": "Know Me",
  "system-status": "System status",
  "achievements": "Achievements",
  "solutions": "Solutions",
  "explore": "Explore",
}

interface SortableWidgetProps {
  layout: WidgetLayout
  title: string
  children: React.ReactNode
  onRemove: () => void
  onResize: () => void
  onInfo: () => void
}

function SortableWidget({ layout, title, children, onRemove, onResize, onInfo }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: layout.id })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${layout.colSpan}`,
    gridRow: `span ${layout.rowSpan}`,
    opacity: isDragging ? 0.45 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="relative group min-h-[160px]">
      <div className="bg-white border border-gray-200 h-full flex flex-col overflow-hidden rounded-[24px]" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
        {/* Widget header */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-gray-100 shrink-0">
          {/* Drag handle */}
          <button
            {...listeners}
            {...attributes}
            className="text-gray-500 group-hover:text-gray-800 cursor-grab active:cursor-grabbing text-base leading-none select-none p-0.5 -ml-0.5 shrink-0"
            title="Drag to reorder"
          >
            ⠿
          </button>

          <span className="text-[17px] font-bold text-gray-900 leading-tight">{title}</span>

          {/* Info button — no border */}
          <button
            onClick={onInfo}
            className="text-[11px] text-[#0073bb] hover:underline cursor-pointer shrink-0 font-medium leading-none"
          >
            Info
          </button>

          <div className="flex-1" />

          {/* Kebab menu */}
          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="text-gray-400 hover:text-gray-700 px-1 text-base leading-none"
              title="Widget options"
            >
              ⋮
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 shadow-lg z-20 py-1 rounded-lg">
                <button
                  onClick={() => { setMenuOpen(false); onRemove() }}
                  className="w-full text-left px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-auto">
          {children}
        </div>

        {/* Resize handle */}
        <button
          onClick={onResize}
          className="absolute bottom-1 right-1 text-gray-300 hover:text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity select-none leading-none"
          title="Resize widget"
        >
          ⤡
        </button>
      </div>
    </div>
  )
}

interface DashboardGridProps {
  widgets: Record<string, React.ReactNode>
}

export default function DashboardGrid({ widgets }: DashboardGridProps) {
  const widgetLayout = useConsoleStore((s) => s.widgetLayout)
  const setWidgetLayout = useConsoleStore((s) => s.setWidgetLayout)
  const removeWidget = useConsoleStore((s) => s.removeWidget)

  const [infoWidgetId, setInfoWidgetId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const visibleWidgets = widgetLayout
    .filter((w) => w.visible && widgets[w.id] !== undefined)
    .sort((a, b) => a.order - b.order)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = visibleWidgets.findIndex((w) => w.id === active.id)
    const newIndex = visibleWidgets.findIndex((w) => w.id === over.id)

    const reordered = arrayMove(visibleWidgets, oldIndex, newIndex).map((w, i) => ({
      ...w,
      order: i,
    }))

    const updated = widgetLayout.map((w) => {
      const found = reordered.find((r) => r.id === w.id)
      return found ? { ...w, order: found.order } : w
    })
    setWidgetLayout(updated)
  }

  function handleResize(id: string) {
    const config = WIDGET_CONFIGS[id]
    if (!config) return
    const current = widgetLayout.find((w) => w.id === id)
    if (!current) return
    const next =
      current.colSpan >= config.maxColSpan ? config.minColSpan : current.colSpan + 1
    setWidgetLayout(
      widgetLayout.map((w) => (w.id === id ? { ...w, colSpan: next } : w))
    )
  }

  return (
    <div className="flex gap-4 items-start">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <div className="flex-1 min-w-0 grid grid-cols-4 gap-4 pb-10" style={{ gridAutoRows: "minmax(170px, auto)" }}>
            {visibleWidgets.map((w) => (
              <SortableWidget
                key={w.id}
                layout={w}
                title={WIDGET_TITLES[w.id] ?? w.id}
                onRemove={() => removeWidget(w.id)}
                onResize={() => handleResize(w.id)}
                onInfo={() => setInfoWidgetId(w.id)}
              >
                {widgets[w.id]}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {infoWidgetId && (
        <div className="w-[300px] shrink-0 sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto">
          <WidgetInfoPanel
            widgetId={infoWidgetId}
            title={WIDGET_TITLES[infoWidgetId] ?? infoWidgetId}
            onClose={() => setInfoWidgetId(null)}
          />
        </div>
      )}
    </div>
  )
}
