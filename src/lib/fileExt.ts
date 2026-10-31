export function fileExt(key: string): string {
  const dot = key.lastIndexOf(".")
  return dot > -1 ? key.slice(dot + 1) : ""
}
