import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import StarField from "./StarField";

gsap.registerPlugin(MotionPathPlugin);

type IntroSunriseProps = { onFinish?: () => void };

export default function IntroSunrise({ onFinish }: IntroSunriseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sunRef       = useRef<HTMLDivElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const textRef      = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sun     = sunRef.current!;
      const glow    = glowRef.current!;
      const text    = textRef.current!;
      const letters = text.querySelectorAll<HTMLElement>(".bv-letter");
      const container = containerRef.current!;

      // initial state
      gsap.set(sun,     { x: "-40vw", y: "34vh", scale: 0.3, opacity: 0 });
      gsap.set(glow,    { opacity: 0 });
      gsap.set(letters, { y: 30, opacity: 0 });

      const tl = gsap.timeline({ onComplete: () => { initCursor(); onFinish?.(); } });

      // 1. Sun rises in arc left → top → right (2s)
      tl.to(sun, {
        duration: 2,
        ease: "sine.inOut",
        opacity: 1,
        scale: 1,
        motionPath: {
          path: [
            { x: "-40vw", y: "34vh" },
            { x: "0vw",   y: "-22vh" },
            { x: "40vw",  y: "34vh" },
          ],
          curviness: 1.4,
        },
        onUpdate: function () {
          const p = this.progress();
          // glow follows the sun height — peaks at top of arc
          const glowO = Math.min(1, p * 3) * Math.max(0, 1 - Math.abs(p - 0.5) * 1.6 + 0.4);
          gsap.set(glow, { opacity: glowO * 0.6 });

          // letters reveal as sun crosses top (p 0.3 → 0.65)
          if (p >= 0.28 && p <= 0.72) {
            const lp = (p - 0.28) / 0.35;
            const show = Math.floor(lp * letters.length);
            letters.forEach((l, i) => {
              if (i <= show) gsap.to(l, { y: 0, opacity: 1, duration: 0.25, ease: "back.out(1.5)", overwrite: "auto" });
            });
          }
        },
      });

      // 2. Sun glides back to center (0.5s)
      tl.to(sun, { x: 0, y: 0, duration: 0.5, ease: "power2.inOut" }, "+=0.15");

      // 3. Letters explode out (0.4s)
      tl.to(letters, {
        opacity: 0, y: () => -80 - Math.random() * 80,
        x: () => (Math.random() - 0.5) * 160,
        rotation: () => (Math.random() - 0.5) * 300,
        scale: 0, duration: 0.38, stagger: 0.018, ease: "power2.out",
      }, "-=0.1");

      // 4. Sun shrinks to a bright point (0.45s)
      tl.to(sun, {
        width: 16, height: 16,
        boxShadow: "0 0 0 6px rgba(255,220,80,0.3), 0 0 30px 12px rgba(255,160,30,0.5)",
        duration: 0.45, ease: "power2.inOut",
      }, "-=0.25");

      // 5. Sun bursts outward and fades (0.55s)
      tl.to(sun, { scale: 10, opacity: 0, duration: 0.55, ease: "power2.in" });

      // 6. Container fades to black — no clip-wipe flash
      tl.to(container, { opacity: 0, duration: 0.35, ease: "power1.in" }, "-=0.3");
    });

    const initCursor = () => {
      if ("ontouchstart" in window || window.innerWidth < 1024) return;
      document.body.classList.add("custom-cursor-active");
      const wrap = document.createElement("div");
      wrap.className = "sun-cursor";
      const dot = document.createElement("div");
      dot.className = "sun-cursor-visual";
      wrap.appendChild(dot);
      document.body.appendChild(wrap);

      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let cx = mx, cy = my;
      gsap.set(wrap, { left: mx, top: my, opacity: 0, scale: 0 });
      gsap.to(wrap, { opacity: 1, scale: 1, duration: 0.35 });

      window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; });

      const tick = () => {
        cx += (mx - cx) * 0.08;
        cy += (my - cy) * 0.08;
        wrap.style.left = `${cx}px`;
        wrap.style.top  = `${cy}px`;
        requestAnimationFrame(tick);
      };
      tick();
    };

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div ref={containerRef} className="intro-container">
      {/* Stars — same as hero, white on dark */}
      <StarField fixed={false} animate={true} color="rgba(255,255,255,0.9)" starCount={220} style={{ zIndex: 0 }} />

      {/* Atmospheric glow — tracks sun movement via JS */}
      <div ref={glowRef} className="intro-atmosphere" />

      {/* Sun disc */}
      <div ref={sunRef} className="intro-sun-disc" />

      {/* Bienvenue */}
      <div ref={textRef} className="intro-name">
        {"Bienvenue".split("").map((ch, i) => (
          <span key={i} className="bv-letter">{ch}</span>
        ))}
      </div>
    </div>
  );
}
