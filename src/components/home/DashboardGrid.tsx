"use client"

import { useState, useRef, useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  pointerWithin,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  CollisionDetection,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useConsoleStore, WidgetLayout } from "@/store/useConsoleStore"
import dashboardLayout from "@data/dashboard-layout.json"
import { useData } from "@/hooks/useData"
import WidgetInfoPanel from "./WidgetInfoPanel"
import { splitPanelPadding } from "@/components/services/ec2/EC2SplitPanel"
import AddWidgetsPanel, { AddWidgetCard, ADD_PREFIX } from "./AddWidgetsPanel"

interface WidgetConfig {
  id: string
  minColSpan: number
  maxColSpan: number
}

const WIDGET_CONFIGS: Record<string, WidgetConfig> = {}
for (const w of dashboardLayout.widgets) {
  WIDGET_CONFIGS[w.id] = { id: w.id, minColSpan: w.minColSpan, maxColSpan: w.maxColSpan }
}

const WIDGET_TITLES: Record<string, string> = {}
for (const w of dashboardLayout.widgets) {
  WIDGET_TITLES[w.id] = w.title
}

interface SortableWidgetProps {
  layout: WidgetLayout
  title: string
  count?: number
  children: React.ReactNode
  onRemove: () => void
  onResize: () => void
  onInfo: () => void
}

function SortableWidget({ layout, title, count, children, onRemove, onResize, onInfo }: SortableWidgetProps) {
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

  // Spans are applied from lg up via CSS variables so phones get a single column
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    "--col": layout.colSpan,
    "--row": layout.rowSpan,
    opacity: isDragging ? 0.45 : 1,
  } as React.CSSProperties

  return (
    <div ref={setNodeRef} style={style} className="relative group min-h-[160px] min-w-0 lg:[grid-column:span_var(--col)] lg:[grid-row:span_var(--row)]">
      <div className="bg-white border border-[#c6c6cd] h-full flex flex-col overflow-hidden rounded-2xl">
        {/* Widget header */}
        <div className="flex items-center gap-2 pl-5 lg:pl-3 pr-4 pt-4 pb-3 shrink-0">
          {/* Drag handle */}
          <button
            {...listeners}
            {...attributes}
            className="hidden lg:block text-[#424650] hover:text-[#0f141a] cursor-grab active:cursor-grabbing select-none p-1 shrink-0"
            title="Drag to reorder"
          >
            <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" aria-hidden="true">
              <circle cx="1.5" cy="2" r="1.5" />
              <circle cx="6.5" cy="2" r="1.5" />
              <circle cx="1.5" cy="7" r="1.5" />
              <circle cx="6.5" cy="7" r="1.5" />
              <circle cx="1.5" cy="12" r="1.5" />
              <circle cx="6.5" cy="12" r="1.5" />
            </svg>
          </button>

          <span className="text-[20px] leading-6 font-bold text-[#0f141a]">
            {title}
            {count !== undefined && <span className="font-normal text-[#656871]"> ({count})</span>}
          </span>

          {/* Info button — no border */}
          <button
            onClick={onInfo}
            className="text-[12px] font-bold text-[#006ce0] hover:underline cursor-pointer shrink-0 self-end pb-0.5"
          >
            Info
          </button>

          <div className="flex-1" />

          {/* Kebab menu */}
          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex text-[#424650] hover:text-[#0f141a] p-1"
              title="Widget options"
            >
              <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor" aria-hidden="true">
                <circle cx="2" cy="2" r="1.75" />
                <circle cx="2" cy="8" r="1.75" />
                <circle cx="2" cy="14" r="1.75" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-[#c6c6cd] shadow-lg z-20 py-1 rounded-lg overflow-hidden">
                <button
                  onClick={() => { setMenuOpen(false); onRemove() }}
                  className="w-full text-left px-4 py-2 text-[14px] text-[#0f141a] hover:bg-[#f0fbff]"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-5 pb-5 overflow-auto">
          {children}
        </div>

        {/* Resize handle */}
        <button
          onClick={onResize}
          className="hidden lg:block absolute bottom-2 right-2 text-[#424650] hover:text-[#006ce0]"
          title="Resize widget"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M11 1 1 11M11 6l-5 5" />
          </svg>
        </button>
      </div>
    </div>
  )
}

const GRID_ID = "dashboard-grid"

// Panel cards land wherever the pointer is released; widgets already in the grid
// reorder against each other only, never against the grid container itself.
const collisionDetection: CollisionDetection = (args) =>
  String(args.active.id).startsWith(ADD_PREFIX)
    ? pointerWithin(args)
    : closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter((c) => c.id !== GRID_ID),
      })

function GridDropZone({ highlight, children }: { highlight: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: GRID_ID })
  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-0 min-h-[170px] grid grid-cols-1 lg:grid-cols-4 gap-5 pb-10 rounded-2xl transition-shadow ${
        highlight && isOver ? "shadow-[0_0_0_2px_#006ce0]" : ""
      }`}
      style={{ gridAutoRows: "minmax(170px, auto)" }}
    >
      {children}
    </div>
  )
}

interface DashboardGridProps {
  widgets: Record<string, React.ReactNode>
  header: React.ReactNode
}

export default function DashboardGrid({ widgets, header }: DashboardGridProps) {
  const widgetLayout = useConsoleStore((s) => s.widgetLayout)
  const setWidgetLayout = useConsoleStore((s) => s.setWidgetLayout)
  const removeWidget = useConsoleStore((s) => s.removeWidget)
  const addWidgetsOpen = useConsoleStore((s) => s.addWidgetsOpen)
  const setAddWidgetsOpen = useConsoleStore((s) => s.setAddWidgetsOpen)

  const addWidget = useConsoleStore((s) => s.addWidget)

  // Header counts appear once the widget's data has arrived
  const solutions = useData("solutions").data
  const explore = useData("explore").data
  const widgetCounts: Record<string, number | undefined> = {
    solutions: solutions?.tabs.reduce((sum, t) => sum + t.items.length, 0),
    achievements: explore?.items.length,
  }

  const [infoWidgetId, setInfoWidgetId] = useState<string | null>(null)
  const [draggedAddId, setDraggedAddId] = useState<string | null>(null)
  const [sheetHeight, setSheetHeight] = useState<number | null>(null)

  // The side slot holds one panel at a time; Add widgets takes precedence
  const showInfo = infoWidgetId !== null && !addWidgetsOpen
  const hiddenIds = widgetLayout
    .filter((w) => !w.visible && widgets[w.id] !== undefined)
    .map((w) => w.id)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const visibleWidgets = widgetLayout
    .filter((w) => w.visible && widgets[w.id] !== undefined)
    .sort((a, b) => a.order - b.order)

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    if (id.startsWith(ADD_PREFIX)) setDraggedAddId(id.slice(ADD_PREFIX.length))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    // A card dragged out of the Add widgets panel: drop it where the pointer is
    if (String(active.id).startsWith(ADD_PREFIX)) {
      setDraggedAddId(null)
      if (!over) return
      const target = event.collisions?.find((c) => c.id !== GRID_ID)
      addWidget(String(active.id).slice(ADD_PREFIX.length), target ? String(target.id) : undefined)
      return
    }

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

  const draggedCard = dashboardLayout.widgets.find((w) => w.id === draggedAddId)

  return (
    <DndContext
      id="dashboard"
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDraggedAddId(null)}
    >
    <div className="flex items-start">
      <div className="flex-1 min-w-0">
        {header}
        <div className="flex gap-4 items-start px-4 lg:px-6 pb-8">
        <SortableContext items={visibleWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <GridDropZone highlight={draggedAddId !== null}>
            {visibleWidgets.map((w) => (
              <SortableWidget
                key={w.id}
                layout={w}
                title={WIDGET_TITLES[w.id] ?? w.id}
                count={widgetCounts[w.id]}
                onRemove={() => removeWidget(w.id)}
                onResize={() => handleResize(w.id)}
                onInfo={() => { setAddWidgetsOpen(false); setInfoWidgetId(w.id) }}
              >
                {widgets[w.id]}
              </SortableWidget>
            ))}
          </GridDropZone>
        </SortableContext>

      {showInfo && (
        <div className="w-[300px] shrink-0 sticky top-[56px] max-h-[calc(100vh-56px)] overflow-y-auto max-lg:fixed max-lg:inset-x-0 max-lg:bottom-[32px] max-lg:z-40 max-lg:w-auto max-lg:max-h-none max-lg:bg-white">
          <WidgetInfoPanel
            widgetId={infoWidgetId}
            title={WIDGET_TITLES[infoWidgetId] ?? infoWidgetId}
            onClose={() => setInfoWidgetId(null)}
          />
        </div>
      )}
        </div>
        {/* Room for the phone bottom sheet so it never hides the last widgets */}
        {addWidgetsOpen && <div className="lg:hidden" style={{ height: splitPanelPadding(sheetHeight) }} />}
      </div>

      {addWidgetsOpen && (
        <AddWidgetsPanel
          availableIds={hiddenIds}
          onAdd={(id) => addWidget(id)}
          sheetHeight={sheetHeight}
          onSheetResize={setSheetHeight}
          onClose={() => setAddWidgetsOpen(false)}
        />
      )}
    </div>

    <DragOverlay dropAnimation={null}>
      {draggedCard && (
        <div className="w-[294px] cursor-grabbing shadow-xl rounded-2xl">
          <AddWidgetCard widget={draggedCard} />
        </div>
      )}
    </DragOverlay>
    </DndContext>
  )
}
