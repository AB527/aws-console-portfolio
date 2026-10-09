export default function SystemStatusWidget() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
        <span className="text-[14px] font-semibold text-gray-800">All services operational</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <span className="text-[13px] font-medium text-gray-500">Open issues</span>
          <span className="text-[13px] font-bold text-gray-800">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[13px] font-medium text-gray-500">Scheduled changes</span>
          <span className="text-[13px] font-bold text-gray-800">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[13px] font-medium text-gray-500">Other notifications</span>
          <span className="text-[13px] font-bold text-gray-800">0</span>
        </div>
      </div>
    </div>
  )
}
