/**
 * Tiny scene store shared by the page (which asks for scenes as you scroll)
 * and the WebGL world (which may load later and reads the latest request).
 */
export const SCENES = ["mark", "wave", "rings", "globe", "dust"] as const;
export type SceneName = (typeof SCENES)[number];
export type SceneAlign = "center" | "left" | "right";

export type SceneRequest = {
  name: SceneName;
  align: SceneAlign;
  /** 0..1 opacity of the particles (lower behind dense text) */
  dim: number;
};

type Listener = (s: SceneRequest) => void;

let current: SceneRequest = { name: "mark", align: "right", dim: 1 };
const listeners = new Set<Listener>();
const focusListeners = new Set<(lat: number, lng: number) => void>();

export const signal = {
  get: () => current,
  set(next: SceneRequest) {
    if (next.name === current.name && next.align === current.align && next.dim === current.dim) return;
    current = next;
    listeners.forEach((fn) => fn(current));
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** Spin the globe to a location (used by the country list) */
  focus(lat: number, lng: number) {
    focusListeners.forEach((fn) => fn(lat, lng));
  },
  onFocus(fn: (lat: number, lng: number) => void) {
    focusListeners.add(fn);
    return () => {
      focusListeners.delete(fn);
    };
  },
};
