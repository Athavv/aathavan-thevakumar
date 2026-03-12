import { useEffect, useRef, type CSSProperties } from "react";

type StarFieldProps = {
  color?: string;
  background?: string;
  fixed?: boolean;
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
  starCount?: number;
};

type Star = {
  x: number;
  baseYRatio: number;
  radius: number;
  opacity: number;
  twinkleSpeed: number;
  currentOpacity: number;
  direction: 1 | -1;
  parallaxFactor: number;
};

export default function StarField({
  color = "#ffffff",
  background,
  fixed = true,
  animate = true,
  className,
  style,
  starCount = 200,
}: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        baseYRatio: Math.random(),
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        currentOpacity: Math.random() * 0.5 + 0.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        parallaxFactor: Math.random() * 0.2 + 0.05,
      });
    }

    const drawFrame = () => {
      if (background) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      const height = canvas.height;

      stars.forEach((star) => {
        const y = star.baseYRatio * height;

        if (animate) {
          star.currentOpacity += star.twinkleSpeed * star.direction;
          if (star.currentOpacity >= 1 || star.currentOpacity <= 0.3) {
            star.direction *= -1;
          }
        } else {
          star.currentOpacity = star.opacity;
        }

        ctx.save();
        ctx.globalAlpha = star.currentOpacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(star.x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (animate) {
        animationFrameId = requestAnimationFrame(drawFrame);
      }
    };

    drawFrame();

    const handleResize = () => {
      resizeCanvas();
      stars.forEach((star) => {
        star.x = Math.random() * canvas.width;
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animate, background, color, starCount]);

  const combinedClassName = ["star-field", className].filter(Boolean).join(" ");
  const combinedStyle: CSSProperties = {
    ...(fixed
      ? { position: "fixed", inset: 0, zIndex: -10 }
      : { position: "absolute", inset: 0 }),
    width: "100%",
    height: "100%",
    display: "block",
    ...style,
  };

  return (
    <canvas
      ref={canvasRef}
      className={combinedClassName}
      style={combinedStyle}
    />
  );
}
