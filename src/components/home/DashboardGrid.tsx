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
import { splitPanelPadding } from "@/components/services/ec2/EC2SplitPanel"
import AddWidgetsPanel, { AddWidgetCard, ADD_PREFIX } from "./AddWidgetsPanel"

const COLUMNS = dashboardLayout.columns
const ROW_HEIGHT = dashboardLayout.rowHeight
// gap-5 of the grid, in px
const GAP = 20

const WIDGET_TITLES: Record<string, string> = {}
for (const w of dashboardLayout.widgets) {
  WIDGET_TITLES[w.id] = w.title
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
// Pixel size of a widget that spans `span` cells
const spanSize = (span: number, step: number) => span * step - GAP

interface SortableWidgetProps {
  layout: WidgetLayout
  title: string
  count?: number
  children: React.ReactNode
  onRemove: () => void
  onResize: (colSpan: number, rowSpan: number) => void
  onResizing: (active: boolean) => void
  onInfo: () => void
}

function SortableWidget({ layout, title, count, children, onRemove, onResize, onResizing, onInfo }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: layout.id })
  const [menuOpen, setMenuOpen] = useState(false)
  // While its corner is dragged the card follows the pointer at this size, above its snapped slot
  const [freeSize, setFreeSize] = useState<{ width: number; height: number } | null>(null)
  const grab = useRef({ x: 0, y: 0 })
  const resizing = freeSize !== null
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

  function startResize(e: React.PointerEvent<HTMLButtonElement>) {
    const widget = e.currentTarget.closest<HTMLElement>("[data-widget]")
    if (!widget) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = widget.getBoundingClientRect()
    grab.current = { x: rect.right - e.clientX, y: rect.bottom - e.clientY }
    setFreeSize({ width: rect.width, height: rect.height })
    onResizing(true)
  }

  // The card tracks the pointer; its slot in the grid snaps to the nearest whole number of cells
  function moveResize(e: React.PointerEvent<HTMLButtonElement>) {
    if (!resizing) return
    const widget = e.currentTarget.closest<HTMLElement>("[data-widget]")
    const grid = widget?.parentElement
    const limits = dashboardLayout.widgets.find((w) => w.id === layout.id)
    if (!widget || !grid || !limits) return
    const rect = widget.getBoundingClientRect()
    const gridRect = grid.getBoundingClientRect()
    const colStep = (gridRect.width + GAP) / COLUMNS
    const rowStep = ROW_HEIGHT + GAP
    // Never wider than the columns left in its row, or the grid would wrap it to the next one
    const startColumn = Math.round((rect.left - gridRect.left) / colStep)
    const maxColSpan = Math.max(limits.minColSpan, Math.min(limits.maxColSpan, COLUMNS - startColumn))
    const width = clamp(
      e.clientX + grab.current.x - rect.left,
      spanSize(limits.minColSpan, colStep),
      spanSize(maxColSpan, colStep)
    )
    const height = clamp(
      e.clientY + grab.current.y - rect.top,
      spanSize(limits.minRowSpan, rowStep),
      spanSize(limits.maxRowSpan, rowStep)
    )
    setFreeSize({ width, height })
    onResize(Math.round((width + GAP) / colStep), Math.round((height + GAP) / rowStep))
  }

  function endResize() {
    if (!resizing) return
    setFreeSize(null)
    onResizing(false)
  }

  function keyResize(e: React.KeyboardEvent) {
    const step: Record<string, [number, number]> = {
      ArrowRight: [1, 0],
      ArrowLeft: [-1, 0],
      ArrowDown: [0, 1],
      ArrowUp: [0, -1],
    }
    const delta = step[e.key]
    if (!delta) return
    e.preventDefault()
    onResize(layout.colSpan + delta[0], layout.rowSpan + delta[1])
  }

  // Spans are applied from lg up via CSS variables so phones get a single column
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    "--col": layout.colSpan,
    "--row": layout.rowSpan,
    opacity: isDragging ? 0.9 : 1,
  } as React.CSSProperties

  // The slot shows where the widget will land; the lifted card sits above the other widgets
  const slotClass = resizing
    ? "z-30 rounded-2xl bg-link/70 shadow-[inset_0_0_0_2px_var(--color-link)]"
    : isDragging
      ? "z-30"
      : ""
  const cardClass = resizing
    ? "absolute top-0 left-0 border-link shadow-[0_0_0_1px_var(--color-link),0_12px_32px_rgba(0,0,0,0.35)]"
    : isDragging
      ? "h-full border-link shadow-[0_0_0_1px_var(--color-link),0_12px_32px_rgba(0,0,0,0.35)]"
      : "h-full border-line"

  return (
    <div ref={setNodeRef} data-widget style={style} className={`relative group min-h-[160px] min-w-0 lg:[grid-column:span_var(--col)] lg:[grid-row:span_var(--row)] ${slotClass}`}>
      <div style={freeSize ?? undefined} className={`bg-surface border flex flex-col overflow-hidden rounded-2xl ${cardClass}`}>
        {/* Widget header */}
        <div className="flex items-center gap-2 pl-5 lg:pl-3 pr-4 pt-4 pb-3 shrink-0">
          {/* Drag handle */}
          <button
            {...listeners}
            {...attributes}
            className="hidden lg:block text-ink-body hover:text-ink cursor-grab active:cursor-grabbing select-none p-1 shrink-0"
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

          <span className="text-[20px] leading-6 font-bold text-ink">
            {title}
            {count !== undefined && <span className="font-normal text-ink-muted"> ({count})</span>}
          </span>

          {/* Info button — no border */}
          <button
            onClick={onInfo}
            className="text-[12px] font-bold text-link hover:underline cursor-pointer shrink-0 self-end pb-0.5"
          >
            Info
          </button>

          <div className="flex-1" />

          {/* Kebab menu */}
          <div ref={menuRef} className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex text-ink-body hover:text-ink p-1"
              title="Widget options"
            >
              <svg width="4" height="16" viewBox="0 0 4 16" fill="currentColor" aria-hidden="true">
                <circle cx="2" cy="2" r="1.75" />
                <circle cx="2" cy="8" r="1.75" />
                <circle cx="2" cy="14" r="1.75" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-surface border border-line shadow-lg z-20 py-1 rounded-lg overflow-hidden">
                <button
                  onClick={() => { setMenuOpen(false); onRemove() }}
                  className="w-full text-left px-4 py-2 text-[14px] text-ink hover:bg-surface-selected"
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
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
          onLostPointerCapture={endResize}
          onKeyDown={keyResize}
          className={`hidden lg:block absolute bottom-2 right-2 cursor-nwse-resize touch-none hover:text-link ${resizing ? "text-link" : "text-ink-body"}`}
          title="Drag to resize"
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

// The cells a widget can snap to, drawn behind the grid while one is resized or moved
function GridCells({ rows }: { rows: number }) {
  return (
    <div
      aria-hidden="true"
      className="hidden lg:grid absolute inset-x-0 top-0 grid-cols-[repeat(var(--cols),minmax(0,1fr))] auto-rows-[var(--row-h)] gap-5 pointer-events-none"
    >
      {Array.from({ length: rows * COLUMNS }, (_, i) => (
        <div key={i} className="rounded-2xl bg-link/40" />
      ))}
    </div>
  )
}

interface GridDropZoneProps {
  highlight: boolean
  // "resize" adds a spare row of cells below, so there is room to grow into
  cells: "resize" | "move" | null
  children: React.ReactNode
}

function GridDropZone({ highlight, cells, children }: GridDropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({ id: GRID_ID })
  const [grid, setGrid] = useState<HTMLDivElement | null>(null)
  const [rows, setRows] = useState(1)

  useEffect(() => {
    if (!grid) return
    const observer = new ResizeObserver(() => {
      setRows(Math.max(1, Math.round((grid.offsetHeight + GAP) / (ROW_HEIGHT + GAP))))
    })
    observer.observe(grid)
    return () => observer.disconnect()
  }, [grid])

  // Rows have a fixed height from lg up, so a widget is always a whole number of cells
  const style = { "--cols": COLUMNS, "--row-h": `${ROW_HEIGHT}px` } as React.CSSProperties

  return (
    <div className="relative flex-1 min-w-0 pb-10" style={style}>
      {cells && <GridCells rows={cells === "resize" ? rows + 1 : rows} />}
      <div
        ref={(el) => {
          setNodeRef(el)
          setGrid(el)
        }}
        className={`relative min-h-[170px] grid grid-cols-1 lg:grid-cols-[repeat(var(--cols),minmax(0,1fr))] auto-rows-[minmax(170px,auto)] lg:auto-rows-[var(--row-h)] gap-5 rounded-2xl transition-shadow ${
          highlight && isOver ? "shadow-[0_0_0_2px_#006ce0]" : ""
        }`}
      >
        {children}
      </div>
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

  const resizeWidget = useConsoleStore((s) => s.resizeWidget)
  const setHelpTopic = useConsoleStore((s) => s.setHelpTopic)
  const [draggedAddId, setDraggedAddId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [resizing, setResizing] = useState(false)
  const [sheetHeight, setSheetHeight] = useState<number | null>(null)

  const hiddenIds = widgetLayout
    .filter((w) => !w.visible && widgets[w.id] !== undefined)
    .map((w) => w.id)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const visibleWidgets = widgetLayout
    .filter((w) => w.visible && widgets[w.id] !== undefined)
    .sort((a, b) => a.order - b.order)

  function handleDragStart(event: DragStartEvent) {
    const id = String(event.active.id)
    setDragging(true)
    if (id.startsWith(ADD_PREFIX)) setDraggedAddId(id.slice(ADD_PREFIX.length))
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setDragging(false)

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

  const draggedCard = dashboardLayout.widgets.find((w) => w.id === draggedAddId)

  return (
    <DndContext
      id="dashboard"
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => { setDragging(false); setDraggedAddId(null) }}
    >
    <div className="flex items-start">
      <div className="flex-1 min-w-0">
        {header}
        <div className="flex gap-4 items-start px-4 lg:px-6 pb-8">
        <SortableContext items={visibleWidgets.map((w) => w.id)} strategy={rectSortingStrategy}>
          <GridDropZone highlight={draggedAddId !== null} cells={resizing ? "resize" : dragging ? "move" : null}>
            {visibleWidgets.map((w) => (
              <SortableWidget
                key={w.id}
                layout={w}
                title={WIDGET_TITLES[w.id] ?? w.id}
                count={widgetCounts[w.id]}
                onRemove={() => removeWidget(w.id)}
                onResize={(colSpan, rowSpan) => resizeWidget(w.id, colSpan, rowSpan)}
                onResizing={setResizing}
                onInfo={() => setHelpTopic(w.id)}
              >
                {widgets[w.id]}
              </SortableWidget>
            ))}
          </GridDropZone>
        </SortableContext>
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
