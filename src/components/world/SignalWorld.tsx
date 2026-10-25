"use client";

import { motionOff } from "@/lib/motion";
import { getScrollY } from "@/lib/scroll";
import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import { gsap } from "gsap";
import { buildShapes } from "./shapes";
import { fragmentShader, vertexShader } from "./shaders";
import { SCENES, signal, type SceneRequest } from "./store";

const FOV = 35;
const DIST = 6;

/** Where each scene sits and how big it is, for the current viewport shape. */
function layoutFor(req: SceneRequest, aspect: number) {
  const visH = 2 * DIST * Math.tan(((FOV / 2) * Math.PI) / 180);
  const visW = visH * aspect;
  const portrait = aspect < 0.9;
  const side = req.align === "right" ? 1 : req.align === "left" ? -1 : 0;
  let x = 0;
  let y = 0;
  let scale = 1;

  switch (req.name) {
    case "mark":
      scale = portrait ? Math.min(0.9, (visW * 0.8) / 2.6) : Math.min(1.1, (visH * 0.66) / 2.5);
      x = portrait ? 0 : side * visW * 0.23;
      y = portrait ? visH * 0.16 : 0.08;
      break;
    case "globe":
      scale = portrait ? Math.min(0.95, (visW * 0.82) / 2.64) : Math.min(0.95, (visH * 0.62) / 2.64);
      x = portrait ? 0 : side * visW * 0.24;
      y = portrait ? visH * 0.16 : 0;
      break;
    case "rings":
      scale = portrait ? 0.62 : 1;
      x = portrait ? 0 : side * visW * 0.2;
      y = portrait ? visH * 0.1 : -0.1;
      break;
    case "wave":
      scale = portrait ? 0.75 : 1;
      y = portrait ? -visH * 0.14 : -0.62;
      break;
    case "dust":
      scale = 1;
      break;
  }
  return { x, y, scale, visW, visH };
}

export default function SignalWorld({ count }: { count: number }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const reduced = motionOff();

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — the page still works without the particles
    }
    const dpr = 1;
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 40);
    camera.position.set(0, 0, DIST);

    const shapes = buildShapes(count);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(shapes.mark, 3));
    geo.setAttribute("aWave", new BufferAttribute(shapes.wave, 3));
    geo.setAttribute("aRings", new BufferAttribute(shapes.rings, 3));
    geo.setAttribute("aGlobe", new BufferAttribute(shapes.globe, 3));
    geo.setAttribute("aDust", new BufferAttribute(shapes.dust, 3));
    geo.setAttribute("aRand", new BufferAttribute(shapes.attrs, 4));

    const state = {
      w0: 0, w1: 0, w2: 0, w3: 0, w4: 1,
      chaos: 0.6,
      alpha: 0,
      ox: 0, oy: 0, scale: 1,
      globeRot: (-79 * Math.PI) / 180,
      mx: 0, my: 0, mouseAmt: 0,
    };

    const uniforms = {
      uTime: { value: 0 },
      uW0: { value: 0 }, uW1: { value: 0 }, uW2: { value: 0 }, uW3: { value: 0 }, uW4: { value: 1 },
      uChaos: { value: 0.6 },
      uGlobeRot: { value: state.globeRot },
      uSize: { value: count < 8000 ? 5 : 3.9 },
      uPixelRatio: { value: dpr },
      uAlpha: { value: 0 },
      uMouse: { value: [0, 0] as [number, number] },
      uMouseAmt: { value: 0 },
      uOffset: { value: [0, 0, 0] as [number, number, number] },
      uScale: { value: 1 },
    };

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(geo, material);
    points.frustumCulled = false;
    scene.add(points);

    let aspect = 1;
    let view = { visW: 1, visH: 1 };
    let dirty = true;

    const apply = (req: SceneRequest, duration: number) => {
      const idx = SCENES.indexOf(req.name);
      const L = layoutFor(req, aspect);
      view = L;
      const d = reduced ? 0 : duration;
      gsap.to(state, {
        w0: idx === 0 ? 1 : 0,
        w1: idx === 1 ? 1 : 0,
        w2: idx === 2 ? 1 : 0,
        w3: idx === 3 ? 1 : 0,
        w4: idx === 4 ? 1 : 0,
        ox: L.x,
        oy: L.y,
        scale: L.scale,
        alpha: req.dim,
        duration: d,
        ease: "power3.inOut",
        overwrite: "auto",
        onUpdate: () => {
          dirty = true;
        },
      });
      if (!reduced && duration > 0.5) {
        gsap
          .timeline()
          .to(state, { chaos: 0.5, duration: 0.55, ease: "power2.out" })
          .to(state, { chaos: 0, duration: 1.5, ease: "power2.inOut" });
      }
      dirty = true;
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      apply(signal.get(), 0.6);
    };
    resize();
    window.addEventListener("resize", resize);

    // Assemble from dust into the first scene
    gsap.to(state, { alpha: signal.get().dim, duration: reduced ? 0 : 1.6, ease: "power2.out" });
    apply(signal.get(), 2.6);

    const unsub = signal.subscribe((req) => apply(req, 1.9));

    let spinPausedUntil = 0;
    const unfocus = signal.onFocus((lat, lng) => {
      const target = (-lng * Math.PI) / 180;
      let diff = (target - state.globeRot) % (Math.PI * 2);
      if (diff > Math.PI) diff -= Math.PI * 2;
      if (diff < -Math.PI) diff += Math.PI * 2;
      spinPausedUntil = performance.now() + 3500;
      gsap.to(state, { globeRot: state.globeRot + diff, duration: reduced ? 0 : 1.4, ease: "power3.inOut", onUpdate: () => void (dirty = true) });
      void lat;
    });

    // Pointer → world position on the z=0 plane
    let lastMove = 0;
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = ((e.clientX / window.innerWidth) * 2 - 1) * (view.visW / 2);
      target.y = (-(e.clientY / window.innerHeight) * 2 + 1) * (view.visH / 2);
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let prev = performance.now();
    let lastScroll = getScrollY();
    let velChaos = 0;
    let lastDrawnAlpha = 1;
    const start = prev;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      if (reduced) {
        if (!dirty) return;
      } else {
        uniforms.uTime.value = (now - start) / 1000;
        if (now > spinPausedUntil) state.globeRot += dt * 0.12;

        // scroll speed stirs the particles a little
        const sy = getScrollY(); // cached — never forces layout mid-frame
        const v = Math.abs(sy - lastScroll) / Math.max(dt, 0.001);
        lastScroll = sy;
        velChaos += (Math.min(0.22, v * 0.00007) - velChaos) * 0.08;

        // cursor
        const active = now - lastMove < 1600 ? 1 : 0;
        state.mouseAmt += (active - state.mouseAmt) * 0.05;
        state.mx += (target.x - state.mx) * 0.1;
        state.my += (target.y - state.my) * 0.1;
      }

      // Nothing visible (e.g. behind a solid section) → don't spend GPU time
      const alphaNow = state.alpha;
      if (alphaNow < 0.004 && lastDrawnAlpha < 0.004) return;
      lastDrawnAlpha = alphaNow;

      uniforms.uW0.value = state.w0;
      uniforms.uW1.value = state.w1;
      uniforms.uW2.value = state.w2;
      uniforms.uW3.value = state.w3;
      uniforms.uW4.value = state.w4;
      uniforms.uChaos.value = state.chaos + velChaos;
      uniforms.uAlpha.value = state.alpha;
      uniforms.uGlobeRot.value = state.globeRot;
      uniforms.uOffset.value = [state.ox, state.oy, 0];
      uniforms.uScale.value = state.scale;
      uniforms.uMouse.value = [state.mx, state.my];
      uniforms.uMouseAmt.value = state.mouseAmt;

      renderer.render(scene, camera);
      dirty = false;
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      unfocus();
      gsap.killTweensOf(state);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      geo.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [count]);

  return <div ref={host} className="absolute inset-0 [&>canvas]:block [&>canvas]:size-full" />;
}
