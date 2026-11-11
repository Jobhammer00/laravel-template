import { defaultDocument } from "@vueuse/core"
import type { ComputedRef, Ref } from "vue"
import { createContext } from "reka-ui"

export const SIDEBAR_COOKIE_NAME = "sidebar_state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

export const [useSidebar, provideSidebarContext] = createContext<{
  state: ComputedRef<"expanded" | "collapsed">
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  isMobile: Ref<boolean>
  openMobile: Ref<boolean>
  setOpenMobile: (value: boolean) => void
  toggleSidebar: () => void
}>("Sidebar")

// Reads, or with a value writes, the sidebar cookie. The prototype host's sandbox
// (no allow-same-origin) throws on any document.cookie access: the sidebar then
// just forgets its state.
export function sidebarCookie(value?: string): string {
  try {
    if (value !== undefined && defaultDocument) defaultDocument.cookie = value
    return defaultDocument?.cookie ?? ""
  }
  catch {
    return ""
  }
}
