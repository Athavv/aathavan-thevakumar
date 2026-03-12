import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";

type MoonProps = {
  onClick?: () => void;
};

export default function Moon({ onClick }: MoonProps) {
  const moonRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<SVGTextElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const text = textRef.current;
      if (!text) return;

      // Rotate the text continuously on hover
      const tl = gsap.timeline({ paused: true });
      tl.to(text, {
        rotation: 360,
        duration: 8,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      const moon = moonRef.current;
      if (!moon) return;

      moon.addEventListener("mouseenter", () => {
        tl.play();
      });

      moon.addEventListener("mouseleave", () => {
        tl.pause();
        gsap.to(text, { rotation: 0, duration: 0.3 });
      });

      return () => {
        moon.removeEventListener("mouseenter", () => {});
        moon.removeEventListener("mouseleave", () => {});
      };
    }, moonRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={moonRef}
      onClick={onClick}
      className="moon-container absolute bottom-12 right-12 cursor-pointer group"
      style={{
        width: "120px",
        height: "120px",
      }}
    >
      {/* Arrow pointing to moon */}
      <div className="absolute -top-16 -left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 50 Q35 40 40 30 Q35 25 30 20"
            stroke="rgba(255, 180, 50, 0.7)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="30"
            cy="10"
            r="3"
            fill="rgba(255, 180, 50, 0.7)"
          />
        </svg>
      </div>

      {/* Moon circle */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm group-hover:border-white/50 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(255,180,50,0.4)] flex items-center justify-center">
        <div className="absolute inset-2 rounded-full border border-white/20"></div>
        <div className="text-white/40 group-hover:text-white/60 transition-colors duration-300 text-sm font-semibold">
          CV
        </div>
      </div>

      {/* Rotating text around moon */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="absolute inset-0"
        style={{ overflow: "visible" }}
      >
        <defs>
          <path
            id="circlePath"
            d="M 60, 60 m -50, 0 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0"
            fill="none"
          />
        </defs>
        <text
          ref={textRef}
          fontSize="12"
          fill="rgba(255, 180, 50, 0.8)"
          fontWeight="600"
          letterSpacing="2"
          className="group-hover:fill-[rgba(255,180,50,1)] transition-colors duration-300"
        >
          <textPath href="#circlePath" startOffset="0%" textAnchor="middle">
            ✦ VOIR LE CV ✦ VOIR LE CV ✦
          </textPath>
        </text>
      </svg>
    </div>
  );
}
