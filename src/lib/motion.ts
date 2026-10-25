/**
 * ─────────────────────────────────────────────────────────────────────
 *  MOTION SETTING — one source of truth for every animation on the site
 * ─────────────────────────────────────────────────────────────────────
 *  <html data-motion="on|off"> is set before first paint by
 *  `motionScript`. Everything (CSS, GSAP, React hooks) reads that
 *  attribute instead of the OS media query, so visitors can override
 *  their device setting with the motion toggle.
 *
 *  Default comes from site.motion.default:
 *    "system" → follow the device's "reduce motion" setting (accessible)
 *    "on"     → always animate unless the visitor turns it off
 * ─────────────────────────────────────────────────────────────────────
 */
import { site } from "@/config/site";

export const MOTION_KEY = "pln:motion";

export const motionScript = `(function(){var d=document.documentElement,s=null;try{s=localStorage.getItem("${MOTION_KEY}")}catch(e){}var sys=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;var off=s?s==="off":(${JSON.stringify(site.motion.default)}==="system"&&sys);d.setAttribute("data-motion",off?"off":"on");if(sys)d.setAttribute("data-motion-system","reduce");})();`;

/** True when animations are switched off (device setting or visitor choice). */
export function motionOff() {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "off";
}

/** Persist the visitor's choice and reload so every effect re-initialises cleanly. */
export function setMotion(on: boolean) {
  try {
    localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  } catch {
    /* storage blocked — the choice just won't persist */
  }
  window.location.reload();
}
