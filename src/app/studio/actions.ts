"use server"

import { createHash } from "crypto"
import { promises as fs } from "fs"
import { dataFilePath, readDataFile, removeObjectFile, writeObjectFile } from "@/lib/studio"
import { sameKind, type Json } from "@/components/studio/json"
import { fileExt } from "@/lib/fileExt"

export type SaveResult = { ok: true } | { ok: false; error: string }

const DEV_ONLY = "The studio only works in development."
const isDev = () => process.env.NODE_ENV === "development"

// Overwrites public/data/<name>.json. Only an existing file can be saved, and only in development.
export async function saveDataFile(name: string, data: Json): Promise<SaveResult> {
  if (!isDev()) return { ok: false, error: DEV_ONLY }

  const file = dataFilePath(name)
  const current = await readDataFile(name)
  if (!file || current === undefined) return { ok: false, error: `There is no data file named "${name}".` }
  if (!sameKind(current, data)) return { ok: false, error: "The top level of the file must stay the same type." }

  try {
    await fs.writeFile(file, JSON.stringify(data, null, 2) + "\n", "utf8")
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The file could not be written." }
  }
}

export interface UploadedDocument {
  fileName: string
  ext: string
  size: string
  type: string
  lastModified: string
  etag: string
}

export type UploadResult = ({ ok: true } & UploadedDocument) | { ok: false; error: string }

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Stores a document's file at public/s3/<id>/file.<ext> and returns the details read from it
export async function uploadDocument(formData: FormData): Promise<UploadResult> {
  if (!isDev()) return { ok: false, error: DEV_ONLY }

  const id = formData.get("id")
  const file = formData.get("file")
  if (typeof id !== "string" || !(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a file to upload." }

  const ext = fileExt(file.name).toLowerCase()
  const content = Buffer.from(await file.arrayBuffer())
  try {
    if (!(await writeObjectFile(id, ext, content))) return { ok: false, error: "The file needs a normal extension such as .pdf or .png." }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The file could not be saved." }
  }

  return {
    ok: true,
    fileName: file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-"),
    ext,
    size: formatSize(file.size),
    type: file.type || "application/octet-stream",
    lastModified: new Date().toISOString().slice(0, 10),
    etag: createHash("md5").update(content).digest("hex"),
  }
}

export async function deleteDocumentFile(id: string): Promise<SaveResult> {
  if (!isDev()) return { ok: false, error: DEV_ONLY }
  try {
    return (await removeObjectFile(id)) ? { ok: true } : { ok: false, error: "That is not a document id." }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "The file could not be deleted." }
  }
}
