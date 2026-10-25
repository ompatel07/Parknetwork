"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { SCENES, signal, type SceneAlign, type SceneName } from "./store";

/**
 * Watches every `[data-scene]` section and tells the particle world which
 * shape to form while it's on screen.
 *   data-scene="mark|wave|rings|globe|dust"
 *   data-scene-align="left|right|center"   (desktop placement)
 *   data-scene-dim="0.4"                   (particle opacity)
 */
export function SceneDirector() {
  const pathname = usePathname();

  useEffect(() => {
    let triggers: ScrollTrigger[] = [];
    const raf = requestAnimationFrame(() => {
      const els = document.querySelectorAll<HTMLElement>("main [data-scene]");
      if (!els.length) signal.set({ name: "dust", align: "center", dim: 0.6 });

      triggers = Array.from(els).map((el) => {
        const name = (el.dataset.scene ?? "dust") as SceneName;
        const req = {
          name: SCENES.includes(name) ? name : "dust",
          align: (el.dataset.sceneAlign ?? "center") as SceneAlign,
          dim: Number(el.dataset.sceneDim ?? 1),
        };
        return ScrollTrigger.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) signal.set(req);
          },
        });
      });

      // Set the scene for wherever the page currently is
      const active = triggers.find((t) => t.isActive);
      const first = els[0];
      if (!active && first && first.getBoundingClientRect().top < window.innerHeight) {
        signal.set({
          name: (first.dataset.scene ?? "dust") as SceneName,
          align: (first.dataset.sceneAlign ?? "center") as SceneAlign,
          dim: Number(first.dataset.sceneDim ?? 1),
        });
      }
    });
    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  return null;
}
