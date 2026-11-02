"use client"

import { useState } from "react"
import Link from "next/link"
import { StateBadge } from "@/components/services/vpc/VpcTable"
import DataStatus from "@/components/ui/DataStatus"
import { useData } from "@/hooks/useData"
import type { RouteTable, Subnet } from "@/lib/vpc"

type Connect = { id: string; name: string; state: string; cidr: string }

interface ConnectViewProps {
  connect: Connect
  subnets: Subnet[]
  routeTables: RouteTable[]
  ownerId: string
}

const TABS = ["Resource map", "CIDRs"]

const CARD = "bg-white rounded-2xl border border-[#c6c6cd]"
const MAP_CARD = `${CARD} w-[360px] shrink-0 px-5 py-5 self-start`
const PILL = "flex items-center gap-3 h-9 px-3 border-2 border-[#8c8c94] rounded-lg bg-white whitespace-nowrap"
// Each map row is a label line + a pill, so rows in neighbouring cards line up for the connectors
const ROW_LABEL = "h-5 pl-4 font-bold truncate"

function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(text)}
      aria-label={`Copy ${label}`}
      className="inline-flex align-middle mr-1.5 text-[#006ce0] hover:text-[#002b66]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="8" y="8" width="13" height="13" />
        <path d="M16 8V3H3v13h5" />
      </svg>
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-bold">{label}</dt>
      <dd className="break-all mt-0.5">{children}</dd>
    </div>
  )
}

export default function ConnectDetail({ connectId }: { connectId: string }) {
  const { data: vpc, error, reload } = useData("vpc")

  if (!vpc) {
    return (
      <div>
        <h1 className="text-[24px] leading-[30px] font-bold break-all mb-4">{connectId}</h1>
        <div className={`${CARD} px-5 py-4`}>
          <h2 className="text-[20px] leading-6 font-bold">Details</h2>
          <DataStatus label="Connect" error={error} onRetry={reload} />
        </div>
      </div>
    )
  }

  return <ConnectView connect={vpc.vpc} subnets={vpc.subnets} routeTables={vpc.routeTables} ownerId={vpc.ownerId} />
}

function ConnectView({ connect, subnets, routeTables, ownerId }: ConnectViewProps) {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <h1 className="text-[24px] leading-[30px] font-bold break-all">{connect.id}</h1>
        <button className="h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap">
          Actions
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
            <path d="M1 3h8L5 8z" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className={`${CARD} px-5 py-4 mb-5`}>
        <div className="flex items-baseline gap-2 mb-4">
          <h2 className="text-[20px] leading-6 font-bold">Details</h2>
          <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-y-4 xl:divide-x divide-[#c6c6cd]">
          <dl className="space-y-4 xl:pr-5">
            <Field label="Connect ID">
              <CopyButton text={connect.id} label="Connect ID" />
              {connect.id}
            </Field>
            <Field label="Name">{connect.name}</Field>
            <Field label="DNS resolution">Enabled</Field>
          </dl>
          <dl className="space-y-4 xl:px-5">
            <Field label="State">
              <StateBadge state={connect.state} />
            </Field>
            <Field label="Tenancy">default</Field>
            <Field label="Default Connect">Yes</Field>
          </dl>
          <dl className="space-y-4 xl:px-5">
            <Field label="Block Public Access">
              <span className="inline-flex items-center gap-1.5 text-[#656871]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
                Off
              </span>
            </Field>
            <Field label="IPv4 CIDR">{connect.cidr}</Field>
            <Field label="Subnets">{subnets.length}</Field>
          </dl>
          <dl className="space-y-4 xl:pl-5">
            <Field label="DNS hostnames">Enabled</Field>
            <Field label="IPv6 pool">–</Field>
            <Field label="Owner ID">
              <CopyButton text={ownerId} label="Owner ID" />
              {ownerId}
            </Field>
          </dl>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-[#c6c6cd] mb-5">
        {TABS.map((tab, i) => (
          <div key={tab} className="flex items-center">
            {i > 0 && <span className="w-px h-6 bg-[#c6c6cd]" />}
            <button
              onClick={() => setActiveTab(tab)}
              className={`relative px-5 py-3 text-[16px] leading-5 font-bold whitespace-nowrap transition-colors ${
                activeTab === tab ? "text-[#006ce0]" : "text-[#424650] hover:text-[#006ce0]"
              }`}
            >
              {tab}
              {activeTab === tab && <span className="absolute left-0 right-0 bottom-0 h-1 rounded-t bg-[#006ce0]" />}
            </button>
          </div>
        ))}
      </div>

      {activeTab === "Resource map" ? (
        <div className={`${CARD} overflow-hidden`}>
          <div className="flex items-center justify-between gap-4 flex-wrap px-5 py-4">
            <div className="flex items-baseline gap-2">
              <h2 className="text-[20px] leading-6 font-bold">Resource map</h2>
              <a className="text-xs font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <button
                role="switch"
                aria-checked={showDetails}
                onClick={() => setShowDetails((v) => !v)}
                className={`relative w-9 h-5 rounded-full transition-colors ${showDetails ? "bg-[#006ce0]" : "bg-[#424650]"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    showDetails ? "translate-x-4" : ""
                  }`}
                />
              </button>
              Show all details
            </label>
          </div>

          <div className="flex gap-[60px] px-11 py-4 bg-[#f6f6f9] overflow-x-auto">
            <div className={MAP_CARD}>
              <h3 className="text-[18px] leading-6 font-bold">Connect</h3>
              <p className="mt-2 mb-5">Your contact network</p>
              <div className={PILL}>{showDetails ? `${connect.id} | ${connect.name}` : connect.id}</div>
            </div>

            <div className={MAP_CARD}>
              <h3 className="text-[18px] leading-6 font-bold">
                Subnets <span className="font-normal">({subnets.length})</span>
              </h3>
              <p className="mt-2 mb-5">Subnets within this Connect</p>
              <div className="space-y-3">
                {subnets.map((subnet, i) => (
                  <div key={subnet.id}>
                    <p className={ROW_LABEL}>{subnet.name}</p>
                    <div className={`${PILL} mt-1`}>
                      <span className="w-5 h-5 shrink-0 flex items-center justify-center rounded-full bg-[#3f8624] text-white text-[10px] font-bold">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="truncate">{showDetails ? `${subnet.id} | ${subnet.cidr}` : subnet.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={MAP_CARD}>
              <h3 className="text-[18px] leading-6 font-bold">
                Route tables <span className="font-normal">({routeTables.length})</span>
              </h3>
              <p className="mt-2 mb-5">Route each subnet to its endpoints</p>
              <div className="space-y-3">
                {subnets.map((subnet) => {
                  const routeTable = routeTables.find((rt) => rt.subnetId === subnet.id)
                  if (!routeTable) return <div key={subnet.id} className="h-[60px]" />
                  return (
                    <div key={routeTable.id}>
                      <p className={ROW_LABEL} aria-hidden="true" />
                      {/* The ::before line runs back across the gap to the matching subnet pill */}
                      <Link
                        href={`/vpc/route-tables?id=${routeTable.id}`}
                        className={`${PILL} relative mt-1 text-[#006ce0] hover:bg-[#f0fbff] before:absolute before:right-full before:top-1/2 before:w-[104px] before:h-0.5 before:mr-0.5 before:bg-[#8c8c94]`}
                      >
                        <span className="truncate">
                          {showDetails
                            ? `${routeTable.id} | ${routeTable.routes.length} route${routeTable.routes.length === 1 ? "" : "s"}`
                            : routeTable.id}
                        </span>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${CARD} px-5 py-4`}>
          <h2 className="text-[20px] leading-6 font-bold mb-3">
            IPv4 CIDRs <span className="font-normal text-[#656871]">({subnets.length + 1})</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#c6c6cd]">
                  <th className="text-left py-1.5 pr-4 font-bold text-[#424650]">CIDR</th>
                  <th className="text-left py-1.5 font-bold text-[#424650]">
                    <span className="block px-4 border-l border-[#c6c6cd]">Resource</span>
                  </th>
                  <th className="text-left py-1.5 font-bold text-[#424650]">
                    <span className="block px-4 border-l border-[#c6c6cd]">Status</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {[connect, ...subnets].map((item) => (
                  <tr key={item.id} className="border-b border-[#ebebf0] last:border-b-0">
                    <td className="pr-4 py-3 whitespace-nowrap">{item.cidr}</td>
                    <td className="px-4 py-3">
                      {item.id} | {item.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[#00802f]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="m7 12 3.5 3.5L17 9" />
                        </svg>
                        Associated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
