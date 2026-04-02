import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

interface RevealOptions {
  y?: number;
  x?: number;
  opacity?: number;
  duration?: number;
  stagger?: number;
  delay?: number;
  ease?: string;
  start?: string;
}

/**
 * Attach a ScrollTrigger reveal to a container ref.
 * All direct children (or the container itself if selector is omitted) animate in.
 *
 * Usage:
 *   const ref = useGsapReveal<HTMLDivElement>(".item");
 *   <div ref={ref}>
 *     <div className="item">...</div>
 *   </div>
 */
export function useGsapReveal<T extends HTMLElement>(
  selector?: string,
  options: RevealOptions = {}
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const {
      y = 40,
      x = 0,
      opacity = 0,
      duration = 0.7,
      stagger = 0.1,
      delay = 0,
      ease = "power2.out",
      start = "top 85%",
    } = options;

    const targets = selector ? el.querySelectorAll(selector) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y, x, opacity },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration,
          stagger,
          delay,
          ease,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}
