import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ALL_SKILLS = [
  { name: "Angular",    logo: "/logos/angular.svg",    color: "#6B48E8", cat: "frontend" },
  { name: "TypeScript", logo: "/logos/typescript.svg", color: "#6B48E8", cat: "frontend" },
  { name: "JavaScript", logo: "/logos/javascript.svg", color: "#6B48E8", cat: "frontend" },
  { name: "HTML",       logo: "/logos/html.svg",       color: "#6B48E8", cat: "frontend" },
  { name: "CSS",        logo: "/logos/css.svg",        color: "#6B48E8", cat: "frontend" },
  { name: "Tailwind",   logo: "/logos/tailwind.svg",   color: "#6B48E8", cat: "frontend" },
  { name: "Bootstrap",  logo: "/logos/bootstrap.svg",  color: "#6B48E8", cat: "frontend" },
  { name: "ChartJS",    logo: "/logos/chartjs.svg",    color: "#6B48E8", cat: "frontend" },
  { name: "PHP",        logo: "/logos/php.svg",        color: "#E8920F", cat: "backend" },
  { name: "Node.js",    logo: "/logos/nodejs.svg",     color: "#E8920F", cat: "backend" },
  { name: "MySQL",      logo: "/logos/mysql.svg",      color: "#E8920F", cat: "backend" },
  { name: "Git",        logo: "/logos/git.svg",        color: "#22d3ee", cat: "tools" },
  { name: "GitHub",     logo: "/logos/github.svg",     color: "#22d3ee", cat: "tools" },
  { name: "Playwright", logo: "/logos/playwright.svg", color: "#22d3ee", cat: "tools" },
  { name: "Figma",      logo: "/logos/figma.svg",      color: "#22d3ee", cat: "tools" },
  { name: "WordPress",  logo: "/logos/wordpress.svg",  color: "#22d3ee", cat: "tools" },
];

const CATEGORIES = [
  { id: "frontend", label: "Frontend",       color: "#6B48E8", skills: ALL_SKILLS.filter(s => s.cat === "frontend") },
  { id: "backend",  label: "Backend & BDD",  color: "#E8920F", skills: ALL_SKILLS.filter(s => s.cat === "backend") },
  { id: "tools",    label: "Outils & Design", color: "#22d3ee", skills: ALL_SKILLS.filter(s => s.cat === "tools") },
];

const STATS = [
  { value: 3,  suffix: " ANS", label: "d'études" },
  { value: 6,  suffix: "",     label: "projets réalisés" },
  { value: 2,  suffix: "",     label: "expériences Xelians" },
];

// Fibonacci sphere distribution
const SPHERE_R  = 190;
const N         = ALL_SKILLS.length;
const GOLDEN    = Math.PI * (3 - Math.sqrt(5));
const SPEED_DEG = 14;
const TILT_X    = 14;
const PERSP     = 900;
const DEG       = Math.PI / 180;

const SPHERE_POINTS = ALL_SKILLS.map((_, i) => {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = GOLDEN * i;
  return { x: Math.cos(theta) * r * SPHERE_R, y: y * SPHERE_R, z: Math.sin(theta) * r * SPHERE_R };
});

// Category index chains for connection lines
const CAT_CHAINS: Record<string, number[]> = {};
CATEGORIES.forEach(cat => {
  CAT_CHAINS[cat.id] = ALL_SKILLS
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.cat === cat.id)
    .map(({ i }) => i);
});

// Project 3D point → 2D canvas coords (relative to scene center)
function project(pt: { x: number; y: number; z: number }, rotRad: number, tiltRad: number) {
  const x1 = pt.x * Math.cos(rotRad) + pt.z * Math.sin(rotRad);
  const z1 = -pt.x * Math.sin(rotRad) + pt.z * Math.cos(rotRad);
  const y1 = pt.y;
  const x2 = x1;
  const y2 = y1 * Math.cos(tiltRad) - z1 * Math.sin(tiltRad);
  const z2 = y1 * Math.sin(tiltRad) + z1 * Math.cos(tiltRad);
  const scale = PERSP / (PERSP + z2);
  return { x: x2 * scale, y: y2 * scale, z: z2 };
}

export default function Skills() {
  const sectionRef    = useRef<HTMLElement>(null);
  const viewportRef   = useRef<HTMLDivElement>(null);
  const sceneRef      = useRef<HTMLDivElement>(null);
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const statRefs      = useRef<(HTMLSpanElement | null)[]>([]);
  const innerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const outerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const rotRef        = useRef(0);
  const rafRef        = useRef(0);
  const lastRef       = useRef(0);
  const [inView, setInView]       = useState(false);
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);
  const [hiddenCats, setHiddenCats] = useState<Set<string>>(new Set());

  // Sync state to refs for RAF access
  const hoveredCatRef = useRef<string | null>(null);
  const hiddenCatsRef = useRef<Set<string>>(new Set());
  useEffect(() => { hoveredCatRef.current = hoveredCat; }, [hoveredCat]);
  useEffect(() => { hiddenCatsRef.current = hiddenCats; }, [hiddenCats]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true);
    }, { threshold: 0.1 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // Size canvas to viewport
  useEffect(() => {
    const vp = viewportRef.current;
    const canvas = canvasRef.current;
    if (!vp || !canvas) return;
    const sync = () => {
      canvas.width  = vp.clientWidth;
      canvas.height = vp.clientHeight;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(vp);
    return () => ro.disconnect();
  }, []);

  // Sphere rotation + canvas connections + per-node opacity
  useEffect(() => {
    if (!inView) return;
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;

    lastRef.current = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      rotRef.current += SPEED_DEG * dt;
      const rot    = rotRef.current;
      const rotRad = rot * DEG;
      const tiltRad = TILT_X * DEG;

      scene.style.transform = `rotateX(${TILT_X}deg) rotateY(${rot}deg)`;

      const hCat   = hoveredCatRef.current;
      const hidden = hiddenCatsRef.current;
      const cW = canvas.width;
      const cH = canvas.height;
      const cx = cW / 2;
      const cy = cH / 2;

      // Canvas connections
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, cW, cH);
        CATEGORIES.forEach(cat => {
          if (hidden.has(cat.id)) return;
          const chain = CAT_CHAINS[cat.id];
          const isFocused = hCat === null || hCat === cat.id;
          for (let k = 0; k < chain.length - 1; k++) {
            const pA = project(SPHERE_POINTS[chain[k]],     rotRad, tiltRad);
            const pB = project(SPHERE_POINTS[chain[k + 1]], rotRad, tiltRad);
            const depthA = (pA.z / SPHERE_R + 1) / 2;
            const depthB = (pB.z / SPHERE_R + 1) / 2;
            const avgDepth = (depthA + depthB) / 2;
            const alpha = avgDepth * (isFocused ? 0.45 : 0.08);
            ctx.beginPath();
            ctx.strokeStyle = cat.color + Math.round(alpha * 255).toString(16).padStart(2, "0");
            ctx.lineWidth = isFocused ? 1.2 : 0.6;
            ctx.moveTo(cx + pA.x, cy + pA.y);
            ctx.lineTo(cx + pB.x, cy + pB.y);
            ctx.stroke();
          }
        });
      }

      // Per-node opacity + counter-rotation + scale
      innerRefs.current.forEach((el, i) => {
        if (!el) return;
        const cat = ALL_SKILLS[i].cat;
        const isHovered = hCat === cat;
        const scaleMult = isHovered ? 1.28 : 1;
        el.style.transform = `rotateY(${-rot}deg) rotateX(${-TILT_X}deg) scale(${scaleMult})`;
      });

      outerRefs.current.forEach((el, i) => {
        if (!el) return;
        const cat = ALL_SKILLS[i].cat;
        if (hidden.has(cat)) { el.style.opacity = "0"; return; }
        const pt = SPHERE_POINTS[i];
        const zWorld = -pt.x * Math.sin(rotRad) + pt.z * Math.cos(rotRad);
        const depth = (zWorld / SPHERE_R + 1) / 2;
        let mult = 1;
        if (hCat !== null) mult = hCat === cat ? 1.2 : 0.1;
        el.style.opacity = (0.15 + depth * 0.85 * mult).toFixed(2);
      });

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView]);

  // Countup stats
  useEffect(() => {
    if (!inView) return;
    const ctx = gsap.context(() => {
      STATS.forEach((stat, i) => {
        const el = statRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value, duration: 1.8, ease: "power2.out", delay: i * 0.15,
          onUpdate: () => { el.textContent = String(Math.round(obj.val)) + stat.suffix; },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [inView]);

  const toggleHidden = (catId: string) => {
    setHiddenCats(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId); else next.add(catId);
      return next;
    });
  };

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <div className="skills-inner">

        <p className="skills-eyebrow">Technologies maîtrisées</p>
        <h2 className="skills-title">Compétences</h2>

        {/* ——— 3D Sphere ——— */}
        <div ref={viewportRef} className="sphere-viewport">
          <canvas ref={canvasRef} className="sphere-canvas" />

          <div className="sphere-fade sphere-fade--top" />
          <div className="sphere-fade sphere-fade--bottom" />
          <div className="sphere-glow" />

          <div className="sphere-scene" ref={sceneRef}>
            {ALL_SKILLS.map((skill, i) => {
              const pt = SPHERE_POINTS[i];
              return (
                <div
                  key={skill.name}
                  ref={el => { outerRefs.current[i] = el; }}
                  className="sphere-node-outer"
                  style={{ transform: `translate3d(${pt.x}px, ${pt.y}px, ${pt.z}px)` }}
                >
                  <div
                    ref={el => { innerRefs.current[i] = el; }}
                    className="sphere-node-inner"
                    style={{ borderColor: `${skill.color}55`, boxShadow: `0 0 14px ${skill.color}25` }}
                  >
                    <img src={skill.logo} alt={skill.name} className="sphere-logo" />
                    <span className="sphere-label" style={{ color: skill.color }}>{skill.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="sphere-legend">
            {CATEGORIES.map(cat => (
              <span key={cat.id} className="sphere-legend-item" style={{ color: cat.color }}>
                <span className="sphere-legend-dot" style={{ background: cat.color }} />{cat.label}
              </span>
            ))}
          </div>
        </div>

        {/* ——— Category chip grids ——— */}
        <div className="skills-categories">
          {CATEGORIES.map((cat, ci) => {
            const isHidden  = hiddenCats.has(cat.id);
            return (
              <div
                key={cat.id}
                className={`skills-cat${inView ? " skills-cat--visible" : ""}${isHidden ? " skills-cat--hidden" : ""}`}
                style={{ transitionDelay: `${ci * 0.1}s` }}
                onMouseEnter={() => setHoveredCat(cat.id)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                <div
                  className="skills-cat-header"
                  onClick={() => toggleHidden(cat.id)}
                  role="button"
                  title={isHidden ? "Afficher dans la sphère" : "Masquer de la sphère"}
                >
                  <span className="skills-cat-dot" style={{ background: isHidden ? "var(--border)" : cat.color }} />
                  <h3 className="skills-cat-title" style={{ color: isHidden ? "var(--fg-muted)" : "var(--fg)" }}>
                    {cat.label}
                  </h3>
                  <span className="skills-cat-toggle">{isHidden ? "+" : "−"}</span>
                </div>
                <div className="skills-cat-grid">
                  {cat.skills.map((s, si) => (
                    <div
                      key={s.name}
                      className={`skill-chip${inView ? " skill-chip--visible" : ""}`}
                      style={{ transitionDelay: `${ci * 0.1 + si * 0.05}s`, opacity: isHidden ? 0.35 : undefined }}
                    >
                      <img src={s.logo} alt={s.name} className="skill-chip-logo" />
                      <span className="skill-chip-name">{s.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ——— Stats ——— */}
        <div className="skills-stats">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="skills-stat">
              <span className="skills-stat-value">
                <span ref={el => { statRefs.current[i] = el; }}>0{stat.suffix}</span>
              </span>
              <span className="skills-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
