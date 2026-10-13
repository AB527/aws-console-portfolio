export function fileExt(key: string): string {
  const dot = key.lastIndexOf(".")
  return dot > -1 ? key.slice(dot + 1) : ""
}

// Objects live at public/s3/<id>/file.<ext>
export function objectFilePath(obj: { id: string; key: string }): string {
  return `/s3/${obj.id}/file.${fileExt(obj.key)}`
}
