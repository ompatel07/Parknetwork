import localFont from "next/font/local";
import { Instrument_Serif, JetBrains_Mono } from "next/font/google";

/** Display — big grotesk headlines */
export const clash = localFont({
  src: [
    { path: "../fonts/clash-display-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/clash-display-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/clash-display-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
  preload: true,
});

/** Body / UI */
export const general = localFont({
  src: [
    { path: "../fonts/general-sans-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/general-sans-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-general",
  display: "swap",
  preload: true,
});

/** Editorial accent — serif italic words inside headlines */
export const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

/** Broadcast HUD labels, timecodes, channel numbers */
export const mono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});
