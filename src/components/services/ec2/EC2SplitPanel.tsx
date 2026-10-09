"use client"

const PANEL_DEFAULT_VH = 0.45
const PANEL_MIN_HEIGHT = 120

// Bottom padding a page needs so the open panel doesn't cover its content
export function splitPanelPadding(height: number | null) {
  return height ? height + 20 : `calc(${PANEL_DEFAULT_VH * 100}vh + 20px)`
}

export default function EC2SplitPanel({
  title,
  open,
  height,
  onResize,
  onClose,
  actions,
  children,
}: {
  title: string
  open: boolean
  height: number | null
  onResize: (height: number) => void
  onClose: () => void
  actions?: React.ReactNode
  children: React.ReactNode
}) {
  // Drag the handle to resize: new height = starting height + distance dragged upward
  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    const startY = e.clientY
    const startHeight = e.currentTarget.parentElement?.getBoundingClientRect().height ?? 0
    const max = window.innerHeight * PANEL_DEFAULT_VH
    const onMove = (ev: PointerEvent) => {
      const next = startHeight + (startY - ev.clientY)
      onResize(Math.min(max, Math.max(PANEL_MIN_HEIGHT, next)))
    }
    const onUp = () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    document.body.style.cursor = "row-resize"
    document.body.style.userSelect = "none"
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
  }

  return (
    <section
      aria-hidden={!open}
      style={{ height: height ?? `${PANEL_DEFAULT_VH * 100}vh` }}
      className={`fixed left-0 lg:left-[280px] right-0 bottom-[32px] z-20 bg-white border-t border-gray-300 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex flex-col transition-transform duration-300 ease-out ${
        open ? "translate-y-0" : "translate-y-[calc(100%+32px)]"
      }`}
    >
      {/* Resize handle */}
      <div
        onPointerDown={startResize}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize panel"
        className="group flex justify-center pt-2 pb-1 cursor-row-resize touch-none"
      >
        <span className="w-8 h-1 rounded-full bg-gray-700 group-hover:bg-[#0073bb] transition-colors" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-3 pb-2">
        <h2 className="text-[20px] font-bold text-gray-900 truncate">{title}</h2>
        <div className="flex items-center gap-3 text-gray-700 shrink-0">
          {actions}
          {actions && <span className="w-px h-6 bg-gray-300" />}
          <button onClick={onClose} title="Close" className="p-1 rounded-full hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
    </section>
  )
}
