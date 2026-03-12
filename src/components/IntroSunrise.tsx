import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import StarField from "./StarField.tsx";

gsap.registerPlugin(MotionPathPlugin);

type IntroSunriseProps = {
  onFinish?: () => void;
};

export default function IntroSunrise({ onFinish }: IntroSunriseProps) {
  const sunRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sun = sunRef.current;
      const container = containerRef.current;
      const text = textRef.current;
      if (!sun || !container || !text) return;

      const letters = text.querySelectorAll<HTMLElement>(".letter");

      const tl = gsap.timeline({
        onComplete: () => {
          initCursorSystem();
          if (onFinish) onFinish();
        },
      });

      // SETUP
      gsap.set(sun, { x: "-45vw", y: "40vh", opacity: 0 });
      gsap.set(letters, { opacity: 0, y: 50, scale: 0.5 });

      // 1. ARC DU SOLEIL (2.2s)
      tl.to(sun, {
        duration: 2.2,
        ease: "sine.inOut",
        opacity: 1,
        motionPath: {
          path: [
            { x: "-45vw", y: "40vh" },
            { x: "0vw", y: "-25vh" },
            { x: "45vw", y: "40vh" },
          ],
          curviness: 1.5,
        },
        onUpdate: function () {
          const progress = this.progress();
          if (progress >= 0.25 && progress <= 0.7) {
            const letterProgress = (progress - 0.25) / 0.35;
            const lettersToShow = Math.floor(letterProgress * letters.length);

            letters.forEach((letter, index) => {
              if (index <= lettersToShow) {
                gsap.to(letter, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.3,
                  ease: "back.out(1.7)",
                  overwrite: "auto",
                });
              }
            });
          }
        },
      });

      // 2. RETOUR AU CENTRE (Impact) - Rapide (0.5s)
      tl.to(
        sun,
        {
          x: "0vw",
          y: "0vh",
          duration: 0.5,
          ease: "power2.inOut",
        },
        2.2,
      );

      // 3. EXPLOSION LETTRES (0.5s)
      tl.to(
        letters,
        {
          opacity: 0,
          y: () => -100 - Math.random() * 100,
          x: () => (Math.random() - 0.5) * 200,
          rotation: () => (Math.random() - 0.5) * 360,
          scale: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: "power2.out",
        },
        2.7,
      );

      // 4. RÉTRÉCISSEMENT (0.6s)
      tl.to(
        sun,
        {
          width: "16px",
          height: "16px",
          boxShadow: "0 0 10px 4px rgba(255,180,50,0.35)",
          duration: 0.6,
          ease: "power2.inOut",
        },
        2.7,
      );

      // 5. LE SAUT (Hop !) - 0.4s (Vif)
      tl.to(
        sun,
        {
          y: "-35vh",
          duration: 0.4,
          ease: "power2.out",
        },
        3.3,
      );

      // 6. LA CHUTE & LE RIDEAU - 0.8s (Lourd et rapide)
      tl.addLabel("falling");

      tl.to(
        sun,
        {
          y: "110vh",
          duration: 0.8,
          ease: "expo.in",
        },
        "falling",
      );

      tl.to(
        container,
        {
          clipPath: "inset(100% 0 0 0)",
          duration: 0.8,
          ease: "expo.in",
        },
        "falling",
      );
    });

    const initCursorSystem = () => {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth < 1024;
      if (isTouch || isSmallScreen) return;

      document.body.classList.add("custom-cursor-active");

      const cursorContainer = document.createElement("div");
      cursorContainer.className = "sun-cursor";

      const cursorVisual = document.createElement("div");
      cursorVisual.className = "sun-cursor-visual";

      cursorContainer.appendChild(cursorVisual);
      document.body.appendChild(cursorContainer);

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let currentX = mouseX;
      let currentY = mouseY;
      let lastX = mouseX;
      let lastY = mouseY;

      gsap.set(cursorContainer, {
        left: mouseX,
        top: mouseY,
        opacity: 0,
        scale: 0,
      });
      gsap.to(cursorContainer, { opacity: 1, scale: 1, duration: 0.4 });

      let frameCount = 0;
      let isHovering = false;

      const handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        const element = document.elementFromPoint(
          e.clientX,
          e.clientY,
        ) as HTMLElement | null;
        const isClickable =
          !!element &&
          (element.tagName === "BUTTON" ||
            element.tagName === "A" ||
            typeof (element as unknown as { onclick?: unknown }).onclick ===
              "function" ||
            window.getComputedStyle(element).cursor === "pointer");

        if (isClickable && !isHovering) {
          isHovering = true;
          gsap.to(cursorVisual, { scale: 1.2, duration: 0.18 });
        } else if (!isClickable && isHovering) {
          isHovering = false;
          gsap.to(cursorVisual, { scale: 1, duration: 0.2 });
        }
      };

      const handleClick = () => {
        if (isHovering) {
          gsap.to(cursorVisual, {
            scale: 0.8,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
          });
        }
      };

      const animateCursor = () => {
        currentX += (mouseX - currentX) * 0.12;
        currentY += (mouseY - currentY) * 0.12;

        cursorContainer.style.left = `${currentX}px`;
        cursorContainer.style.top = `${currentY}px`;

        const velocityX = currentX - lastX;
        const velocityY = currentY - lastY;
        const speed = Math.hypot(velocityX, velocityY);
        if (speed > 1.4) {
          frameCount++;
          if (frameCount % 3 === 0) {
            createTrail(
              currentX,
              currentY,
              Math.atan2(velocityY, velocityX),
              speed,
            );
          }
        }
        lastX = currentX;
        lastY = currentY;
        requestAnimationFrame(animateCursor);
      };

      const createTrail = (
        x: number,
        y: number,
        angle: number,
        speed: number,
      ) => {
        const ray = document.createElement("div");
        ray.className = "trail-ray";
        ray.style.left = `${x}px`;
        ray.style.top = `${y}px`;
        ray.style.setProperty("--trail-angle", `${angle}rad`);
        ray.style.setProperty(
          "--trail-scale",
          String(Math.min(1.8, 0.75 + speed * 0.08)),
        );
        document.body.appendChild(ray);
        gsap.to(ray, {
          opacity: 0,
          scaleX: 0.45,
          scaleY: 0.8,
          duration: 0.38,
          onComplete: () => ray.remove(),
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);
      animateCursor();
    };

    return () => ctx.revert();
  }, [onFinish]);

  return (
    <div ref={containerRef} className="intro-container">
      <StarField
        fixed={false}
        animate={false}
        color="rgba(255,255,255,0.95)"
        starCount={200}
        style={{ zIndex: 0 }}
      />
      <h1 ref={textRef} className="intro-text">
        {"Bienvenue".split("").map((char, index) => (
          <span key={index} className="letter">
            {char}
          </span>
        ))}
      </h1>
      <div ref={sunRef} className="intro-sun"></div>
    </div>
  );
}
