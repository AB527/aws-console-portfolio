import fs from "fs"
import path from "path"
import { fileExt } from "@/lib/fileExt"

// Objects live at public/s3/<id>/file.<ext>. Returns the public URL, or "" if the file hasn't been added yet.
export function objectFileUrl(obj: { id: string; key: string }): string {
  const relative = path.posix.join("s3", obj.id, `file.${fileExt(obj.key)}`)
  return fs.existsSync(path.join(process.cwd(), "public", relative)) ? `/${relative}` : ""
}
