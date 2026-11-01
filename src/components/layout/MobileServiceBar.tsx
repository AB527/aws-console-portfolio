import MobileNavToggle from "./MobileNavToggle"

// Phone-only bar that hosts the sidebar toggle for services without their own top bar
export default function MobileServiceBar({ title }: { title: string }) {
  return (
    <div className="lg:hidden flex items-center gap-3 px-4 py-2.5 bg-white border-b border-[#c6c6cd]">
      <MobileNavToggle />
      <span className="text-[16px] font-bold text-[#0f141a] truncate">{title}</span>
    </div>
  )
}
