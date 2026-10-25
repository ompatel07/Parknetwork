/**
 * One shared, cached window scroll position.
 *
 * Reading `window.scrollY` makes the browser finish any pending style/layout
 * work first. Inside animation frames — after other code has just changed
 * styles — that repeats the work many times per frame (layout thrashing,
 * the main cause of scroll jank on phones). Instead, one passive scroll
 * listener reads it once per scroll event and everyone else reads the cache.
 */
type Listener = (y: number) => void;

let y = 0;
let bound = false;
const listeners = new Set<Listener>();

const onScroll = () => {
  y = window.scrollY;
  listeners.forEach((fn) => fn(y));
};

function bind() {
  if (bound || typeof window === "undefined") return;
  bound = true;
  y = window.scrollY;
  window.addEventListener("scroll", onScroll, { passive: true });
}

/** Last known scroll position — never forces layout. */
export function getScrollY() {
  bind();
  return y;
}

/** Calls `fn` with the new position on every scroll. Returns an unsubscribe. */
export function onScrollY(fn: Listener) {
  bind();
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
