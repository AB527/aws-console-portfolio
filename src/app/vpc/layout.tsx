import VpcShell from "@/components/services/vpc/VpcShell"

export default function VpcLayout({ children }: { children: React.ReactNode }) {
  return <VpcShell>{children}</VpcShell>
}
