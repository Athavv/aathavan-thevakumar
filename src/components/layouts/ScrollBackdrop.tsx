import { useEffect, useRef, type ReactNode } from "react";
import StarField from "../StarField";
import { gsap } from "gsap";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const toHex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
const rgb   = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

type ScrollBackdropProps = { children?: ReactNode };

// ——— Shared reveal hook ———
function useReveal(delay = 0) {
  const elRef   = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let rafId = 0;
    const tick = () => {
      const t = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--backdrop-t") || "0");
      if (t > 0.55 && !revealed.current) {
        revealed.current = true;
        gsap.fromTo(el,
          { scale: 0.65, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.8)", delay }
        );
      }
      if (!revealed.current) rafId = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(rafId);
  }, [delay]);

  return elRef;
}

// ——— Sparkle SVG icon ———
function Sparkle({ color = "#E8920F" }: { color?: string }) {
  return (
    <svg className="sb-sparkle" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 1L11.8 8.2L19 10L11.8 11.8L10 19L8.2 11.8L1 10L8.2 8.2L10 1Z" fill={color} fillOpacity="0.9" />
    </svg>
  );
}

// ——— Badge: Poste Actuel (Xelians) ———
function BadgeXelians({ className }: { className: string }) {
  const elRef = useReveal(0);
  return (
    <div ref={elRef} className={`sb-star-badge sb-star-badge--xelians ${className}`} style={{ opacity: 0 }}>
      <div className="sb-star-top-line" />
      <div className="sb-star-header">
        <Sparkle color="#E8920F" />
        <span className="sb-star-eyebrow">Poste actuel</span>
      </div>
      <span className="sb-star-value">@ Xelians</span>
      <div className="sb-star-footer">
        <div className="sb-star-live-dot" />
        <span className="sb-star-live-label">En poste</span>
      </div>
    </div>
  );
}

// ——— Badge: Formation ———
function BadgeFormation({ className }: { className: string }) {
  const elRef = useReveal(0.12);
  return (
    <div ref={elRef} className={`sb-star-badge sb-star-badge--formation ${className}`} style={{ opacity: 0 }}>
      <div className="sb-star-top-line" />
      <div className="sb-star-header">
        <Sparkle color="#6B48E8" />
        <span className="sb-star-eyebrow">Formation</span>
      </div>
      <span className="sb-star-value">BUT MMI</span>
      <span className="sb-star-sub">Promotion 2026</span>
      <div className="sb-star-progress">
        <div className="sb-star-progress-fill" style={{ width: "85%" }} />
      </div>
    </div>
  );
}


export default function ScrollBackdrop({ children }: ScrollBackdropProps) {
  const darkRef      = useRef<HTMLDivElement | null>(null);
  const overflowRef  = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el       = darkRef.current;
    const overflow = overflowRef.current;
    if (!el) return;

    let rafId = 0;

    const update = () => {
      const t     = Math.min(1, Math.max(0, window.scrollY / 900));
      const textT = Math.min(1, Math.max(0, (t - 0.8) / 0.2));

      const fg    = { r: lerp(255, 15, textT),  g: lerp(255, 17, textT),  b: lerp(255, 26, textT) };
      const fgMut = { r: lerp(220, 70, textT),  g: lerp(220, 75, textT),  b: lerp(220, 90, textT) };

      const root = document.documentElement;
      root.style.setProperty("--fg",           rgb(fg.r, fg.g, fg.b));
      root.style.setProperty("--fg-muted",     rgb(fgMut.r, fgMut.g, fgMut.b));
      root.style.setProperty("--fg-rgb",       `${Math.round(fg.r)}, ${Math.round(fg.g)}, ${Math.round(fg.b)}`);
      root.style.setProperty("--fg-muted-rgb", `${Math.round(fgMut.r)}, ${Math.round(fgMut.g)}, ${Math.round(fgMut.b)}`);
      root.style.setProperty("--backdrop-t",   String(t));

      const vi = 7 * t;
      const hi = 8 * t;
      const r  = 40 * Math.min(1, Math.max(0, (t - 0.1) / 0.9));
      el.style.clipPath = `inset(${vi}% ${hi}% ${vi}% ${hi}% round ${r}px)`;

      if (overflow) {
        overflow.style.opacity = String(Math.min(1, (t - 0.4) / 0.5));
      }
    };

    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.documentElement.style.removeProperty("--fg");
      document.documentElement.style.removeProperty("--fg-muted");
      document.documentElement.style.removeProperty("--fg-rgb");
      document.documentElement.style.removeProperty("--fg-muted-rgb");
      document.documentElement.style.removeProperty("--backdrop-t");
    };
  }, []);

  return (
    <div className="sb-root" aria-hidden="true">
      {/* Cream base — same as --bg, no color jump */}
      <div className="sb-base">
        <StarField fixed={false} animate={false} color="rgba(13,12,10,0.55)" starCount={240} style={{ zIndex: 1 }} />
      </div>

      {/* Dark shrinking card */}
      <div ref={darkRef} className="sb-dark">
        <StarField fixed={false} animate={true} color="rgba(255,255,255,0.9)" starCount={260} style={{ zIndex: 1 }} />
        <div className="sb-content">{children}</div>
        <div className="sb-sun" />
      </div>

      {/* Stars that overflow downward from cream area */}
      <div ref={overflowRef} className="sb-star-overflow" style={{ opacity: 0 }}>
        <StarField fixed={false} animate={false} color="rgba(13,12,10,0.32)" starCount={100} style={{ zIndex: 1 }} />
      </div>

      {/* Star-themed animated badges */}
      <BadgeXelians   className="sb-badge-1" />
      <BadgeFormation className="sb-badge-2" />
    </div>
  );
}
