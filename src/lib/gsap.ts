"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionOff } from "./motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  gsap.defaults({ ease: "expo.out", duration: 1 });
}

export { gsap, ScrollTrigger, useGSAP };

/**
 * Media query for gsap.matchMedia() that only matches while motion is on
 * (see lib/motion.ts). Pass an extra query to combine, e.g. "(min-width: 1024px)".
 */
export const motionQuery = (q = "all") => (motionOff() ? "not all" : q);
