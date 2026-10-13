"use client"

interface ConfirmDialogProps {
  title: string
  children: React.ReactNode
  // Omitted when the action is not allowed; the dialog then only explains why
  confirmLabel?: string
  busy?: boolean
  onConfirm?: () => void
  onClose: () => void
}

export default function ConfirmDialog({ title, children, confirmLabel, busy = false, onConfirm, onClose }: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
        <h2 className="px-5 pt-5 text-[20px] leading-6 font-bold text-gray-900">{title}</h2>
        <div className="px-5 py-4 text-sm text-gray-900">{children}</div>
        <div className="flex justify-end gap-2 px-5 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-5 rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff]"
          >
            {confirmLabel ? "Cancel" : "Close"}
          </button>
          {confirmLabel && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className="h-8 px-5 rounded-full bg-[#d91515] text-sm font-bold text-white hover:bg-[#b30f0f] disabled:bg-gray-200 disabled:text-gray-400"
            >
              {busy ? "Deleting" : confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
