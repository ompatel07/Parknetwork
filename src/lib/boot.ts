/* Inline <head> boot scripts (server-safe: no "use client"). */

/** Key used to show the preloader on the first visit only. */
export const PRELOADER_KEY = "pln:preloaded";

/**
 * Runs in <head> before paint. Returning visitors get `data-preloaded`
 * on <html>, which hides the preloader via CSS with no flash.
 */
export const preloaderScript = `document.documentElement.classList.add("js");try{if(localStorage.getItem("${PRELOADER_KEY}")){document.documentElement.setAttribute("data-preloaded","")}else{localStorage.setItem("${PRELOADER_KEY}","1")}}catch(e){}`;
