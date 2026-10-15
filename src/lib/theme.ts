export type VisualMode = "browser-default" | "light" | "dark"
export type Theme = "light" | "dark"

export const STORE_KEY = "ab-console-state"
// The key used before the rename; its saved state is moved over once
const OLD_STORE_KEY = "aws-console-state"
export const DARK_QUERY = "(prefers-color-scheme: dark)"

// "browser-default" follows the visitor's system setting; the other two force a theme
export function resolveTheme(mode: VisualMode, prefersDark: boolean): Theme {
  if (mode === "browser-default") return prefersDark ? "dark" : "light"
  return mode
}

// Runs in <head> before first paint, so a dark visitor never sees the light page.
// Same rule as resolveTheme, reading the mode the store persisted. It first moves state saved under the
// old key, before the store reads it.
export const themeScript = `(function(){try{var o=localStorage.getItem(${JSON.stringify(OLD_STORE_KEY)});if(o!==null){if(localStorage.getItem(${JSON.stringify(STORE_KEY)})===null)localStorage.setItem(${JSON.stringify(STORE_KEY)},o);localStorage.removeItem(${JSON.stringify(OLD_STORE_KEY)})}}catch(e){}try{var m=(JSON.parse(localStorage.getItem(${JSON.stringify(STORE_KEY)})||"{}").state||{}).visualMode;var d=m==="dark"||(m!=="light"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches);document.documentElement.dataset.theme=d?"dark":"light"}catch(e){}})()`
