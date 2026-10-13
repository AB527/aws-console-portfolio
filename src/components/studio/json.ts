export type Json = string | number | boolean | null | Json[] | JsonObject
export interface JsonObject {
  [key: string]: Json
}

export function isObject(value: Json): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function sameKind(a: Json, b: Json): boolean {
  if (Array.isArray(a) || Array.isArray(b)) return Array.isArray(a) && Array.isArray(b)
  return isObject(a) === isObject(b)
}
