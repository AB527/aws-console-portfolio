"use client"

import { useState } from "react"
import { formatDate } from "@/lib/formatDate"
import { fileExt } from "@/lib/fileExt"
import { openSans } from "@/lib/awsFont"

type S3Object = {
  id: string
  key: string
  size: string
  lastModified: string
  type: string
  storageClass: string
  etag: string
  url: string
}

interface ObjectDetailProps {
  bucketName: string
  region: string
  regionLabel: string
  owner: string
  obj: S3Object
}

const TABS = ["Properties", "Permissions", "Versions"]

const ALL_USERS_GROUP = "http://acs.amazonaws.com/groups/global/AllUsers"

const copy = (text: string) => navigator.clipboard?.writeText(text)

function InfoIcon() {
  return (
    <svg className="shrink-0 mt-0.5 text-[#006ce0]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 11v6M12 7v.5" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="shrink-0 mt-0.5 text-[#855900]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3 2 21h20L12 3z" />
      <path d="M12 10v5M12 18v.5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="8" y="8" width="13" height="13" />
      <path d="M16 8V3H3v13h5" />
    </svg>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  return (
    <button
      onClick={() => copy(text)}
      aria-label={`Copy ${label}`}
      className="inline-flex align-middle mr-1.5 text-[#006ce0] hover:text-[#002b66]"
    >
      <CopyIcon />
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-bold text-[#0f141a]">{label}</dt>
      <dd className="text-sm text-[#0f141a] break-all mt-0.5">{children}</dd>
    </div>
  )
}

export default function ObjectDetail({ bucketName, region, regionLabel, owner, obj }: ObjectDetailProps) {
  const [activeTab, setActiveTab] = useState("Properties")

  const s3Uri = `s3://${bucketName}/${obj.key}`
  const arn = `arn:aws:s3:::${bucketName}/${obj.key}`
  const objectUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${obj.key}`

  const activeBtn =
    "h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#006ce0] text-sm font-bold text-[#006ce0] hover:bg-[#f0fbff] whitespace-nowrap"
  const disabledBtn =
    "h-8 px-5 flex items-center gap-2 rounded-full border-2 border-[#b4b4bb] text-sm font-bold text-[#8c8c94] cursor-not-allowed whitespace-nowrap"

  const downloadIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12M6 10l6 6 6-6M4 21h16" />
    </svg>
  )
  const externalIcon = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 3h7v7M21 3l-9 9M10 5H3v16h16v-7" />
    </svg>
  )

  const caretIcon = (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <path d="M1 3h8L5 8z" />
    </svg>
  )

  return (
    <div className={`${openSans.className} px-6 py-5 text-[14px] leading-5 text-[#0f141a]`}>
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div className="flex items-baseline gap-2 min-w-0">
          <h1 className="text-[24px] leading-[30px] font-bold text-[#0f141a] break-all">{obj.key}</h1>
          <a className="text-sm font-bold text-[#006ce0] hover:underline cursor-pointer">Info</a>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => copy(s3Uri)} className={activeBtn}>
            <CopyIcon />
            Copy S3 URI
          </button>
          {obj.url ? (
            <a href={obj.url} download={obj.key} className={activeBtn}>
              {downloadIcon}
              Download
            </a>
          ) : (
            <button disabled className={disabledBtn}>
              {downloadIcon}
              Download
            </button>
          )}
          {obj.url ? (
            <a href={obj.url} target="_blank" rel="noopener noreferrer" className={activeBtn}>
              Open
              {externalIcon}
            </a>
          ) : (
            <button disabled className={disabledBtn}>
              Open
              {externalIcon}
            </button>
          )}
          <button disabled className={disabledBtn}>
            Object actions
            {caretIcon}
          </button>
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
              {activeTab === tab && (
                <span className="absolute left-0 right-0 bottom-0 h-1 rounded-t bg-[#006ce0]" />
              )}
            </button>
          </div>
        ))}
      </div>

      {activeTab === "Properties" ? (
        <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
          <h2 className="text-[20px] leading-6 font-bold text-[#0f141a] mb-4">Object overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <dl className="space-y-4 md:pr-6">
              <Field label="Owner">{owner}</Field>
              <Field label="AWS Region">{regionLabel}</Field>
              <Field label="Last modified">{formatDate(obj.lastModified)}</Field>
              <Field label="Size">{obj.size}</Field>
              <Field label="Type">{fileExt(obj.key)}</Field>
              <Field label="Key">{obj.key}</Field>
            </dl>
            <dl className="space-y-4 mt-4 md:mt-0 md:pl-6 md:border-l border-[#c6c6cd]">
              <Field label="S3 URI">
                <CopyButton text={s3Uri} label="S3 URI" />
                {s3Uri}
              </Field>
              <Field label="Amazon Resource Name (ARN)">
                <CopyButton text={arn} label="ARN" />
                {arn}
              </Field>
              <Field label="Entity tag (Etag)">
                <CopyButton text={obj.etag} label="Etag" />
                {obj.etag}
              </Field>
              <Field label="Object URL">
                <CopyButton text={objectUrl} label="Object URL" />
                {obj.url ? (
                  <a href={obj.url} target="_blank" rel="noopener noreferrer" className="text-[#006ce0] hover:underline">
                    {objectUrl}
                  </a>
                ) : (
                  objectUrl
                )}
              </Field>
            </dl>
          </div>
        </div>
      ) : activeTab === "Permissions" ? (
        <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-[20px] leading-6 font-bold text-[#0f141a]">Access control list (ACL)</h2>
              <p className="text-sm text-[#424650] mt-1">
                Grant basic read/write permissions to AWS accounts.{" "}
                <a className="text-[#006ce0] underline cursor-pointer">Learn more ↗</a>
              </p>
            </div>
            <button disabled className={disabledBtn}>
              Edit
            </button>
          </div>

          <div className="flex gap-2 mt-5 px-4 py-3 rounded-xl border-2 border-[#006ce0] bg-[#f0fbff]">
            <InfoIcon />
            <div className="text-sm text-[#0f141a]">
              <p className="font-bold text-[#0f141a]">
                This bucket has the bucket owner enforced setting applied for Object Ownership
              </p>
              <p>
                When <a className="text-[#006ce0] underline cursor-pointer">bucket owner enforced</a> is applied, use
                bucket policies to control access. <a className="text-[#006ce0] underline cursor-pointer">Learn more ↗</a>
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#c6c6cd]">
                  <th className="text-left py-2.5 font-bold text-[#424650]">Grantee</th>
                  <th className="text-left px-4 py-2.5 font-bold text-[#424650] w-36">Object</th>
                  <th className="text-left px-4 py-2.5 font-bold text-[#424650] w-40">Object ACL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#c6c6cd]">
                  <td className="py-3">
                    <p className="font-bold text-[#0f141a]">Object owner (your AWS account)</p>
                    <p className="text-xs text-[#0f141a] break-all mt-0.5">
                      Canonical ID: <CopyButton text={owner} label="Canonical ID" />
                      {owner}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#0f141a]">Read</td>
                  <td className="px-4 py-3 text-[#0f141a]">Read, Write</td>
                </tr>
                <tr>
                  <td className="py-3">
                    <p className="font-bold text-[#0f141a]">Everyone (public access)</p>
                    <p className="text-xs text-[#0f141a] break-all mt-0.5">
                      Group: <CopyButton text={ALL_USERS_GROUP} label="Group" />
                      {ALL_USERS_GROUP}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[#0f141a]">-</td>
                  <td className="px-4 py-3 text-[#0f141a]">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap px-4 py-3 mb-4 rounded-xl border-2 border-[#855900] bg-[#fffef0]">
            <div className="flex gap-2 min-w-0">
              <WarningIcon />
              <div className="text-sm text-[#0f141a]">
                <p className="font-bold text-[#0f141a]">
                  Bucket &quot;{bucketName}&quot; doesn&apos;t have Bucket Versioning enabled
                </p>
                <p>
                  We recommend that you enable Bucket Versioning to help protect against unintentionally overwriting or
                  deleting objects. <a className="text-[#006ce0] underline cursor-pointer">Learn more ↗</a>
                </p>
              </div>
            </div>
            <button
              disabled
              className="h-8 px-5 rounded-full border-2 border-[#424650] text-sm font-bold text-[#424650] cursor-not-allowed whitespace-nowrap"
            >
              Enable Bucket Versioning
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#c6c6cd] px-5 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-[20px] leading-6 font-bold text-[#0f141a]">
                Versions <span className="font-normal text-[#656871]">(0)</span>
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <button disabled className={disabledBtn}>
                  {downloadIcon}
                  Download
                </button>
                <button disabled className={disabledBtn}>
                  Open
                  {externalIcon}
                </button>
                <button disabled className={disabledBtn}>
                  Delete
                </button>
                <button disabled className={disabledBtn}>
                  Actions
                  {caretIcon}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-3 text-sm">
              <span className="text-gray-400">‹</span>
              <span className="font-bold text-[#0f141a]">1</span>
              <span className="text-[#424650]">›</span>
            </div>

            <div className="mt-2 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c6c6cd]">
                    <th className="py-2.5 w-10 text-left">
                      <input type="checkbox" disabled className="rounded border-[#c6c6cd]" />
                    </th>
                    {["Version ID", "Type", "Last modified", "Size", "Storage class"].map((col) => (
                      <th key={col} className="text-left px-3 py-2.5 font-bold text-[#424650] border-l border-[#c6c6cd]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#424650]">
                      <p className="font-bold">No versions</p>
                      <p className="mt-1">
                        This object has no versions to display because Bucket Versioning has not been enabled for this
                        bucket.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
