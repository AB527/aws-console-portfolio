"use client"

import { useEffect } from "react"
import { useDraggable } from "@dnd-kit/core"
import EC2SplitPanel from "@/components/services/ec2/EC2SplitPanel"
import dashboardLayout from "@data/dashboard-layout.json"
import menu from "@data/services-menu.json"

// Drag ids of panel cards are prefixed so the grid can tell them apart from its own widgets
export const ADD_PREFIX = "add:"

type WidgetEntry = (typeof dashboardLayout.widgets)[number]

function Illustration({ id }: { id: string }) {
  if (id === "favourites") {
    return (
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="0.9" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
        <path d="M12 2l3 6.5 7 .6-5.3 4.6 1.6 6.9L12 17.8 5.7 20.6l1.6-6.9L2 9.1l7-.6z" />
      </svg>
    )
  }
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none" strokeWidth="2.5" strokeLinecap="round" className="shrink-0" aria-hidden="true">
      <circle cx="7" cy="8" r="5" stroke="var(--color-ink)" />
      <path d="M20 5h56M20 12h28" stroke="var(--color-ink)" />
      <circle cx="7" cy="28" r="5" stroke="var(--color-link)" />
      <path d="M20 25h56M20 32h28" stroke="var(--color-link)" />
      <circle cx="7" cy="48" r="5" stroke="var(--color-ink)" />
      <path d="M20 45h56M20 52h28" stroke="var(--color-ink)" />
    </svg>
  )
}

export function AddWidgetCard({ widget }: { widget: WidgetEntry }) {
  return (
    <div className="bg-surface border border-line rounded-2xl px-5 pt-4 pb-6">
      <div className="flex items-center gap-2">
        <span className="text-ink-body p-1 shrink-0">
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor" aria-hidden="true">
            <circle cx="1.5" cy="2" r="1.5" />
            <circle cx="6.5" cy="2" r="1.5" />
            <circle cx="1.5" cy="7" r="1.5" />
            <circle cx="6.5" cy="7" r="1.5" />
            <circle cx="1.5" cy="12" r="1.5" />
            <circle cx="6.5" cy="12" r="1.5" />
          </svg>
        </span>
        <span className="text-[20px] leading-6 font-bold text-ink">{widget.title}</span>
      </div>
      <div className="flex items-center gap-4 mt-5">
        <Illustration id={widget.id} />
        <p className="text-[14px] leading-5 text-ink">{widget.description}</p>
      </div>
    </div>
  )
}

function DraggableCard({ widget, onAdd }: { widget: WidgetEntry; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: ADD_PREFIX + widget.id })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onAdd}
      onKeyDown={(e) => { if (e.key === "Enter") onAdd() }}
      className={`cursor-grab active:cursor-grabbing select-none touch-none ${isDragging ? "opacity-40" : ""}`}
    >
      <AddWidgetCard widget={widget} />
    </div>
  )
}

interface AddWidgetsPanelProps {
  // Widget ids that are currently off the dashboard
  availableIds: string[]
  onAdd: (id: string) => void
  onClose: () => void
  // Height of the phone bottom sheet (null = default)
  sheetHeight: number | null
  onSheetResize: (height: number) => void
}

export default function AddWidgetsPanel({ availableIds, onAdd, onClose, sheetHeight, onSheetResize }: AddWidgetsPanelProps) {
  const available = dashboardLayout.widgets.filter((w) => availableIds.includes(w.id))

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  const empty = <p className="text-[14px] leading-5 text-ink-body">{menu.addWidgets.empty}</p>

  return (
    <>
    {/* Phones: resizable bottom sheet, tap a card to add it */}
    <div className="lg:hidden">
      <EC2SplitPanel
        title={menu.addWidgets.title}
        open
        height={sheetHeight}
        onResize={onSheetResize}
        onClose={onClose}
      >
        <div className="flex flex-col gap-4 pt-2">
          {available.length > 0
            ? available.map((w) => (
                <button key={w.id} onClick={() => onAdd(w.id)} className="block w-full text-left">
                  <AddWidgetCard widget={w} />
                </button>
              ))
            : empty}
        </div>
      </EC2SplitPanel>
    </div>

    <aside className="hidden lg:block w-[350px] shrink-0 bg-surface border-l border-line overflow-y-auto sticky top-[56px] h-[calc(100vh-88px)]">
      <div className="flex items-center justify-between px-7 pt-5 pb-4">
        <h2 className="text-[18px] leading-[22px] font-bold text-ink">{menu.addWidgets.title}</h2>
        <button
          onClick={onClose}
          aria-label={menu.close}
          title={menu.close}
          className="text-ink-body hover:text-ink transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M2 2l14 14M16 2L2 16" />
          </svg>
        </button>
      </div>

      <div className="px-7 pb-6 flex flex-col gap-5">
        {available.length > 0 ? (
          available.map((w) => <DraggableCard key={w.id} widget={w} onAdd={() => onAdd(w.id)} />)
        ) : (
          empty
        )}
      </div>
    </aside>
    </>
  )
}
