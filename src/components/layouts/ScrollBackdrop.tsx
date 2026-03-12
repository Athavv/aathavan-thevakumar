import { useEffect, useRef, type ReactNode } from "react";
import StarField from "../StarField.tsx";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (v: number) => Math.round(v).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

type ScrollBackdropProps = {
  children?: ReactNode;
};

export default function ScrollBackdrop({ children }: ScrollBackdropProps) {
  const blackLayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = blackLayerRef.current;
    if (!el) return;

    let rafId = 0;

    const update = () => {
      const scrollY = window.scrollY;
      const start = 0;
      const end = 420;
      const t = Math.min(1, Math.max(0, (scrollY - start) / (end - start)));
      const textT = Math.min(1, Math.max(0, (t - 0.8) / 0.2));

      // Foreground color transitions (white -> near-black) to stay readable
      const fg = {
        r: lerp(255, 15, textT),
        g: lerp(255, 17, textT),
        b: lerp(255, 26, textT),
      };

      const fgMuted = {
        r: lerp(220, 70, textT),
        g: lerp(220, 75, textT),
        b: lerp(220, 90, textT),
      };

      document.documentElement.style.setProperty(
        "--fg",
        rgbToHex(fg.r, fg.g, fg.b),
      );
      document.documentElement.style.setProperty(
        "--fg-muted",
        rgbToHex(fgMuted.r, fgMuted.g, fgMuted.b),
      );
      document.documentElement.style.setProperty(
        "--fg-rgb",
        `${Math.round(fg.r)}, ${Math.round(fg.g)}, ${Math.round(fg.b)}`,
      );
      document.documentElement.style.setProperty(
        "--fg-muted-rgb",
        `${Math.round(fgMuted.r)}, ${Math.round(fgMuted.g)}, ${Math.round(fgMuted.b)}`,
      );

      document.documentElement.style.setProperty("--backdrop-t", String(t));

      const verticalInset = 8 * t;
      const horizontalInset = 9 * t;
      const radiusT = Math.min(1, Math.max(0, (t - 0.1) / 0.9));
      const radius = 48 * radiusT;

      el.style.clipPath = `inset(${verticalInset}% ${horizontalInset}% ${verticalInset}% ${horizontalInset}% round ${radius}px)`;
      el.style.opacity = "1";
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    const onResize = () => {
      onScroll();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);

      document.documentElement.style.removeProperty("--fg");
      document.documentElement.style.removeProperty("--fg-muted");
      document.documentElement.style.removeProperty("--fg-rgb");
      document.documentElement.style.removeProperty("--fg-muted-rgb");
      document.documentElement.style.removeProperty("--backdrop-t");
    };
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <div className="absolute inset-0 overflow-hidden bg-white">
        <StarField
          fixed={false}
          animate={false}
          color="rgba(0,0,0,0.96)"
          starCount={320}
          style={{ zIndex: 1 }}
        />
      </div>
      <div
        ref={blackLayerRef}
        className="absolute inset-0 overflow-hidden bg-[#05060a] [clip-path:inset(0%_0%_0%_0%_round_0px)] will-change-[clip-path,opacity]"
      >
        <StarField
          fixed={false}
          animate={false}
          color="rgba(255,255,255,1)"
          starCount={320}
          style={{ zIndex: 1 }}
        />
        <div className="absolute inset-0 z-10">{children}</div>
        <div
          className="absolute right-[22px] top-[18px] h-[54px] w-[54px] rounded-full transition-opacity duration-200"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #fff7c8 0%, #ffdd55 45%, #ff9900 100%)",
            boxShadow:
              "0 0 20px rgba(255, 180, 50, 0.35), 0 0 60px rgba(255, 180, 50, 0.18)",
            opacity: "calc(var(--backdrop-t, 0) * 1)",
            transform: "scale(calc(0.9 + var(--backdrop-t, 0) * 0.15))",
          }}
        />
        <div
          className="absolute left-[18px] top-1/2 h-px w-[120px]"
          style={{
            background: "rgba(255, 255, 255, 0.18)",
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.04)",
            opacity: "calc(var(--backdrop-t, 0) * 1)",
            transform:
              "translateY(-50%) scaleX(calc(0.6 + var(--backdrop-t, 0) * 0.6))",
            transformOrigin: "center",
          }}
        />
        <div
          className="absolute right-[18px] top-1/2 h-px w-[120px]"
          style={{
            background: "rgba(255, 255, 255, 0.18)",
            boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.04)",
            opacity: "calc(var(--backdrop-t, 0) * 1)",
            transform:
              "translateY(-50%) scaleX(calc(0.6 + var(--backdrop-t, 0) * 0.6))",
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
}
