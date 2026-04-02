# Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completely redesign the portfolio with a Hybrid Editorial digital-agency aesthetic — Clash Display typography, dark navy palette (violet + amber accents), GSAP ScrollTrigger animations on every section.

**Architecture:** Replace all visual components in-place, keeping the React/Vite/Tailwind v4 stack. GSAP ScrollTrigger drives all scroll-based animations (replaces the vanilla scroll listener in Projects). App.tsx is stripped of old intro/starfield logic and replaced with a `<Grain />` overlay. A new `Skills` section is inserted between `AboutMe` and `Experience`.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, GSAP 3.13 (ScrollTrigger already bundled in gsap package), Clash Display via Fontshare CDN, JetBrains Mono via @fontsource/jetbrains-mono

---

## File Map

**CREATE:**
- `src/components/ui/Grain.tsx` — fixed noise texture overlay
- `src/components/ui/FloatingCard.tsx` — glassmorphism stat card for Hero
- `src/components/layouts/Footer.tsx` — minimal footer
- `src/components/sections/Skills.tsx` — new skills + stats section
- `src/hooks/useGsapReveal.ts` — reusable ScrollTrigger reveal utility
- `src/data/skills.json` — skills data
- `src/style/_skills.css` — skills section styles
- `src/style/_footer.css` — footer styles

**REPLACE (full rewrite):**
- `src/index.css` — CSS tokens, font imports, global reset
- `src/style/custom.css` — import map for all section CSS
- `src/style/_header.css` — header styles
- `src/style/_hero.css` — hero styles
- `src/style/_projects.css` — projects carousel styles
- `src/style/_aboutMe.css` — about section styles
- `src/style/_experience.css` — experience section styles
- `src/style/_contact.css` — contact section styles
- `src/components/layouts/Header.tsx` — pill navbar
- `src/components/sections/Hero.tsx` — full hero redesign
- `src/components/sections/Projects.tsx` — GSAP ScrollTrigger carousel
- `src/components/sections/AboutMe.tsx` — dark redesign with animated timeline
- `src/components/sections/Experience.tsx` — editorial cards
- `src/components/sections/Contact.tsx` — oversized title + magnetic CTA
- `src/App.tsx` — remove IntroSunrise/StarField, add Grain
- `src/main.tsx` — register GSAP plugins
- `src/pages/Home.tsx` — new section order

**DELETE (after all sections implemented):**
- `src/components/IntroSunrise.tsx`
- `src/components/StarField.tsx`
- `src/components/Moon.tsx`
- `src/components/layouts/ScrollBackdrop.tsx`
- `src/components/animations/BlurIn.tsx`
- `src/style/_introSunrise.css`
- `src/style/_scrollBackdrop.css`

---

## Task 1: CSS Foundations — Tokens, Fonts, Global Reset

**Files:**
- Modify: `src/index.css`
- Modify: `src/style/custom.css`

- [ ] **Step 1: Install JetBrains Mono**

```bash
npm install @fontsource/jetbrains-mono
```

Expected: package added to node_modules, package.json updated.

- [ ] **Step 2: Replace `src/index.css` entirely**

```css
@import "tailwindcss";
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --bg:           #07080f;
  --surface-1:    #0f1020;
  --surface-2:    #141528;
  --accent-v:     #7B5CF0;
  --accent-a:     #F5A623;
  --fg:           #FFFFFF;
  --fg-muted:     #6B7280;
  --border:       rgba(255,255,255,0.08);
  --max-w:        1200px;
  --px:           clamp(24px, 6vw, 80px);
}

html {
  width: 100%;
  scroll-behavior: auto; /* GSAP handles smooth scroll */
}

body {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--bg);
  color: var(--fg);
  font-family: "Inter", "Helvetica Neue", sans-serif;
}

/* Grain overlay via pseudo-element */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
}

#root {
  width: 100%;
  min-height: 100vh;
}

/* Typography utilities */
.font-clash  { font-family: "Clash Display", sans-serif; }
.font-mono   { font-family: "JetBrains Mono", monospace; }

/* Global section title (override per section as needed) */
.section-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-a);
  margin-bottom: 1rem;
}

/* Reusable pill button */
.btn-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 12px 24px;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease;
  cursor: pointer;
  border: none;
}
.btn-pill:hover { transform: translateY(-2px); }

.btn-violet {
  background: var(--accent-v);
  color: #fff;
}
.btn-violet:hover { background: #8b6cf5; }

.btn-outline {
  background: transparent;
  color: var(--fg);
  border: 1px solid var(--border);
}
.btn-outline:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); }

.btn-amber {
  background: var(--accent-a);
  color: #0a0a0a;
  font-weight: 700;
}
.btn-amber:hover { background: #f7b847; }
```

- [ ] **Step 3: Replace `src/style/custom.css` entirely**

```css
/* Portfolio — section styles */
@import "./_header.css";
@import "./_hero.css";
@import "./_projects.css";
@import "./_aboutMe.css";
@import "./_skills.css";
@import "./_experience.css";
@import "./_contact.css";
@import "./_footer.css";
```

- [ ] **Step 3b: Create stub files for CSS not yet written (prevents build errors)**

```bash
touch src/style/_skills.css src/style/_footer.css
```

- [ ] **Step 4: Verify build compiles**

```bash
npm run build
```

Expected: exits with code 0, no TypeScript errors (may have warnings about unused old components — those get deleted later).

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/style/custom.css package.json package-lock.json
git commit -m "feat: add CSS foundations, tokens, and Clash Display + JetBrains Mono fonts"
```

---

## Task 2: GSAP Setup + App.tsx Cleanup

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace `src/main.tsx`**

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./index.css";
import "./style/custom.css";
import App from "./App.tsx";

gsap.registerPlugin(ScrollTrigger);

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [ ] **Step 2: Replace `src/App.tsx`**

Remove IntroSunrise, StarField, SunRouteTransition. Keep routing. Route transitions are now handled at the page level.

```tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
    </Router>
  );
}
```

- [ ] **Step 3: Verify build still compiles**

```bash
npm run build
```

Expected: exits 0. Errors about IntroSunrise/StarField imports being missing will not appear because those are only imported inside the files we just replaced.

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat: register GSAP ScrollTrigger, simplify App routing"
```

---

## Task 3: useGsapReveal Hook

**Files:**
- Create: `src/hooks/useGsapReveal.ts`

- [ ] **Step 1: Create `src/hooks/useGsapReveal.ts`**

This hook wraps the common pattern of "reveal element(s) when they enter the viewport via ScrollTrigger".

```ts
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npm run build
```

Expected: exits 0, hook file is valid TypeScript.

> **Note:** Section components (Hero, Projects, About, etc.) use `gsap.context()` directly for fine-grained control. `useGsapReveal` is an optional utility — not used in plan tasks below, but available for simple cases.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useGsapReveal.ts
git commit -m "feat: add useGsapReveal hook for ScrollTrigger reveal animations"
```

---

## Task 4: FloatingCard UI Component

**Files:**
- Create: `src/components/ui/FloatingCard.tsx`

- [ ] **Step 1: Create `src/components/ui/FloatingCard.tsx`**

```tsx
interface FloatingCardProps {
  label: string;
  value: string;
  icon?: string;
  className?: string;
}

export default function FloatingCard({ label, value, icon, className = "" }: FloatingCardProps) {
  return (
    <div
      className={`floating-card ${className}`}
      style={{
        background: "rgba(15, 16, 32, 0.75)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "14px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: "140px",
      }}
    >
      {icon && <span style={{ fontSize: "1.1rem" }}>{icon}</span>}
      <span
        style={{
          fontFamily: "Clash Display, sans-serif",
          fontWeight: 700,
          fontSize: "1rem",
          color: "#FFFFFF",
          lineHeight: 1.2,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.65rem",
          color: "rgba(255,255,255,0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/FloatingCard.tsx
git commit -m "feat: add FloatingCard glassmorphism component"
```

---

## Task 5: Header Redesign

**Files:**
- Modify: `src/components/layouts/Header.tsx`
- Modify: `src/style/_header.css`

- [ ] **Step 1: Replace `src/style/_header.css`**

```css
.site-header {
  position: fixed;
  z-index: 60;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.28s ease, opacity 0.28s ease;
}

.site-header--hidden {
  transform: translateY(-120%);
  opacity: 0;
}

.header-pill {
  position: relative;
  width: min(1180px, calc(100% - 32px));
  border-radius: 9999px;
  backdrop-filter: blur(20px);
  background: rgba(10, 11, 22, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 48px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  pointer-events: auto;
}

.header-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 9999px;
  background: linear-gradient(135deg, var(--accent-v), #5b3dd6);
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: #fff;
  letter-spacing: 0.02em;
  text-decoration: none;
  flex-shrink: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: nowrap;
}

.header-link {
  color: rgba(255,255,255,0.65);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 9px 14px;
  border-radius: 9999px;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.header-link:hover,
.header-link--active {
  color: #fff;
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.08);
}

.header-link-cta {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: #0a0a0a !important;
  background: linear-gradient(135deg, var(--accent-a), #e8900f) !important;
  border-color: transparent !important;
  padding: 9px 18px;
  box-shadow: 0 6px 20px rgba(245,166,35,0.22);
}

.header-link-cta:hover {
  background: linear-gradient(135deg, #f7c04a, #f09d1f) !important;
  transform: translateY(-1px);
}

/* Mobile */
@media (max-width: 640px) {
  .site-header { top: 14px; }

  .header-pill {
    width: calc(100% - 20px);
    border-radius: 20px;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 12px;
  }

  .header-nav {
    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 4px;
  }

  .header-nav::-webkit-scrollbar { display: none; }

  .header-link { font-size: 0.72rem; padding: 7px 11px; }
}
```

- [ ] **Step 2: Replace `src/components/layouts/Header.tsx`**

```tsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";

const NAV_LINKS = [
  { label: "Projets",     href: "/#projects" },
  { label: "À propos",   href: "/#about" },
  { label: "Skills",     href: "/#skills" },
  { label: "Expérience", href: "/#experience" },
  { label: "Contact",    href: "/#contact" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 80);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      const id = href.slice(2);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={`site-header${hidden ? " site-header--hidden" : ""}`}>
      <div className="header-pill">
        <Link to="/" className="header-brand">AT</Link>

        <nav className="header-nav">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="header-link"
              onClick={(e) => handleAnchor(e, href)}
            >
              {label}
            </a>
          ))}
          <a
            href={monCV}
            target="_blank"
            rel="noopener noreferrer"
            className="header-link header-link-cta"
          >
            CV
          </a>
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Start dev server and verify header renders**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected: fixed pill navbar at top with "AT" logo, nav links, amber CV button. Hides on scroll down, reappears on scroll up.

- [ ] **Step 4: Commit**

```bash
git add src/components/layouts/Header.tsx src/style/_header.css
git commit -m "feat: redesign header with Clash Display branding and hide-on-scroll"
```

---

## Task 6: Footer Component

**Files:**
- Create: `src/components/layouts/Footer.tsx`
- Create: `src/style/_footer.css`

- [ ] **Step 1: Create `src/style/_footer.css`**

```css
.site-footer {
  width: 100%;
  padding: 24px var(--px);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.site-footer__name {
  font-family: "Clash Display", sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

.site-footer__credit {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.25);
  letter-spacing: 0.06em;
}

.site-footer__credit span {
  color: var(--accent-v);
}
```

- [ ] **Step 2: Create `src/components/layouts/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer__name">Aathavan Thevakumar © 2026</span>
      <span className="site-footer__credit">
        Fait avec <span>GSAP</span> &amp; React
      </span>
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/Footer.tsx src/style/_footer.css
git commit -m "feat: add minimal footer component"
```

---

## Task 7: Hero Redesign

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/style/_hero.css`

- [ ] **Step 1: Replace `src/style/_hero.css`**

```css
.hero-section {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 120px var(--px) 80px;
}

/* Curtain element (animates away on load) */
.hero-curtain {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: var(--accent-v);
  transform-origin: left center;
}

/* Background oversized ghost name */
.hero-bg-name {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
  user-select: none;
  padding-left: var(--px);
  z-index: 0;
}

.hero-bg-name span {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(6rem, 14vw, 14rem);
  line-height: 0.88;
  text-transform: uppercase;
  color: rgba(255,255,255,0.025);
  letter-spacing: -0.04em;
  white-space: nowrap;
}

/* Two-column layout */
.hero-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--max-w);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

/* Left col */
.hero-left {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero-tagline {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent-a);
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero-tagline::before {
  content: "";
  display: inline-block;
  width: 28px;
  height: 1px;
  background: var(--accent-a);
}

.hero-name-wrap {
  overflow: hidden;
}

.hero-name {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(3.6rem, 7.5vw, 7.5rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: #fff;
  display: block;
  will-change: transform;
}

.hero-desc {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--fg-muted);
  max-width: 52ch;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-scroll-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.hero-scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.4), transparent);
  transform-origin: top center;
}

.hero-scroll-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* Right col */
.hero-right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
}

.hero-photo-wrap {
  position: relative;
  z-index: 2;
}

.hero-photo {
  width: clamp(240px, 30vw, 380px);
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: center top;
  display: block;
  clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
  filter: drop-shadow(0 0 40px rgba(123,92,240,0.35));
}

.hero-photo-border {
  position: absolute;
  inset: -8px;
  clip-path: polygon(8% 0%, 100% 0%, 92% 100%, 0% 100%);
  background: linear-gradient(135deg, rgba(123,92,240,0.4), transparent 60%);
  z-index: 1;
  pointer-events: none;
}

/* Floating cards */
.hero-card-1 {
  position: absolute;
  top: 8%;
  left: -10%;
  z-index: 3;
}

.hero-card-2 {
  position: absolute;
  bottom: 20%;
  right: -5%;
  z-index: 3;
}

.hero-card-3 {
  position: absolute;
  bottom: 5%;
  left: -5%;
  z-index: 3;
}

/* Mobile */
@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .hero-right {
    order: -1;
    min-height: 320px;
  }

  .hero-photo {
    width: clamp(180px, 55vw, 280px);
  }

  .hero-card-1 { top: 0; left: 0; }
  .hero-card-2 { bottom: 0; right: 0; }
  .hero-card-3 { display: none; }
}

@media (max-width: 540px) {
  .hero-section { padding: 100px var(--px) 60px; }
  .hero-actions { flex-direction: column; }
  .hero-actions .btn-pill { width: 100%; justify-content: center; }
}
```

- [ ] **Step 2: Replace `src/components/sections/Hero.tsx`**

```tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";
import FloatingCard from "../ui/FloatingCard";

const FIRST = "Aathavan";
const LAST = "Thevakumar";

function splitLetters(text: string, cls: string) {
  return text.split("").map((ch, i) => (
    <span key={i} className={cls} style={{ display: "inline-block", willChange: "transform" }}>
      {ch === " " ? "\u00A0" : ch}
    </span>
  ));
}

export default function Hero() {
  const sectionRef  = useRef<HTMLElement | null>(null);
  const curtainRef  = useRef<HTMLDivElement | null>(null);
  const firstRef    = useRef<HTMLSpanElement | null>(null);
  const lastRef     = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const curtain   = curtainRef.current;
      const firstEl   = firstRef.current;
      const lastEl    = lastRef.current;
      const section   = sectionRef.current;

      if (!curtain || !firstEl || !lastEl || !section) return;

      const firstLetters = firstEl.querySelectorAll<HTMLElement>(".hero-letter");
      const lastLetters  = lastEl.querySelectorAll<HTMLElement>(".hero-letter");
      const tagline      = section.querySelector<HTMLElement>(".hero-tagline");
      const desc         = section.querySelector<HTMLElement>(".hero-desc");
      const actions      = section.querySelector<HTMLElement>(".hero-actions");
      const scrollInd    = section.querySelector<HTMLElement>(".hero-scroll-indicator");
      const photo        = section.querySelector<HTMLElement>(".hero-photo-wrap");
      const cards        = section.querySelectorAll<HTMLElement>(".floating-card");

      // Start: hide everything
      gsap.set([...firstLetters, ...lastLetters], { yPercent: 110, rotate: 3 });
      gsap.set([tagline, desc, actions, scrollInd], { y: 28, opacity: 0 });
      gsap.set(photo, { scale: 0.88, opacity: 0 });
      gsap.set(cards, { y: 20, opacity: 0, scale: 0.92 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Curtain sweeps right → off screen
      tl.to(curtain, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.85,
        ease: "power4.inOut",
      })
      // 2. Letters cascade in
      .to([...firstLetters, ...lastLetters], {
        yPercent: 0,
        rotate: 0,
        duration: 1.0,
        stagger: 0.03,
        ease: "expo.out",
      }, "-=0.4")
      // 3. Tagline + desc + actions
      .to([tagline, desc, actions], {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.1,
      }, "-=0.5")
      // 4. Photo
      .to(photo, {
        scale: 1,
        opacity: 1,
        duration: 0.75,
        ease: "power2.out",
      }, "-=0.65")
      // 5. Floating cards stagger
      .to(cards, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.12,
        ease: "back.out(1.4)",
      }, "-=0.4")
      // 6. Scroll indicator
      .to(scrollInd, {
        y: 0,
        opacity: 1,
        duration: 0.5,
      }, "-=0.2");

      // Ongoing: scroll line pulse
      gsap.to(".hero-scroll-line", {
        scaleY: 0.4,
        transformOrigin: "top center",
        duration: 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.5,
      });

      // Ongoing: gentle float on name
      gsap.to([firstEl, lastEl], {
        y: -6,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="hero-section">
      {/* Curtain */}
      <div ref={curtainRef} className="hero-curtain" />

      {/* Ghost background name */}
      <div className="hero-bg-name" aria-hidden>
        <span>Aathavan</span>
        <span>Thevakumar</span>
      </div>

      <div className="hero-inner">
        {/* Left */}
        <div className="hero-left">
          <p className="hero-tagline">Développeur Full Stack</p>

          <div>
            <div className="hero-name-wrap">
              <span ref={firstRef} className="hero-name">
                {splitLetters(FIRST, "hero-letter")}
              </span>
            </div>
            <div className="hero-name-wrap">
              <span ref={lastRef} className="hero-name">
                {splitLetters(LAST, "hero-letter")}
              </span>
            </div>
          </div>

          <p className="hero-desc">
            Je conçois des expériences web modernes, performantes et accessibles.
            Alternant chez Xelians, passionné de design et de code.
          </p>

          <div className="hero-actions">
            <Link to="/projects" className="btn-pill btn-violet">
              Voir mes projets
            </Link>
            <a href="#contact" className="btn-pill btn-outline">
              Me contacter
            </a>
            <a
              href={monCV}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-amber"
            >
              Mon CV
            </a>
          </div>

          <div className="hero-scroll-indicator">
            <div className="hero-scroll-line" />
            <span className="hero-scroll-label">Scroll</span>
          </div>
        </div>

        {/* Right */}
        <div className="hero-right">
          <div className="hero-photo-wrap">
            <div className="hero-photo-border" />
            <img
              src={aathavanPhoto}
              alt="Aathavan Thevakumar"
              className="hero-photo"
            />
          </div>

          <FloatingCard
            label="Poste actuel"
            value="@ Xelians"
            icon="💼"
            className="hero-card-1"
          />
          <FloatingCard
            label="Formation"
            value="BUT MMI 2026"
            icon="🎓"
            className="hero-card-2"
          />
          <FloatingCard
            label="Projets réalisés"
            value="6 projets"
            icon="🚀"
            className="hero-card-3"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected: violet curtain sweeps away on load, name cascades letter by letter, photo fades in with glassmorphism floating cards. Ghost name visible faintly in background.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Hero.tsx src/style/_hero.css src/components/ui/FloatingCard.tsx
git commit -m "feat: redesign Hero with GSAP curtain reveal, oversized name, floating cards"
```

---

## Task 8: Projects Carousel Redesign (GSAP ScrollTrigger)

**Files:**
- Modify: `src/components/sections/Projects.tsx`
- Modify: `src/style/_projects.css`

- [ ] **Step 1: Replace `src/style/_projects.css`**

```css
.projects-section {
  position: relative;
  background: var(--bg);
  overflow: hidden;
}

.projects-header {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 80px var(--px) 0;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.projects-title {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(3rem, 7vw, 6.5rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: var(--fg);
}

.projects-count {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  color: var(--fg-muted);
  letter-spacing: 0.12em;
  padding-bottom: 8px;
  white-space: nowrap;
}

.projects-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.projects-viewport {
  overflow: visible;
  padding: 0 var(--px);
}

.projects-track {
  display: flex;
  align-items: flex-end;
  gap: 0;
  will-change: transform;
}

/* Project cards */
.project-card {
  flex-shrink: 0;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;
  display: block;
  position: relative;
  border: 1px solid rgba(255,255,255,0.06);
  background: var(--surface-1);
  transform-origin: bottom center;
  transition: border-color 0.3s;
  will-change: transform;
}

.project-card:hover { border-color: rgba(255,255,255,0.14); }

.project-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.project-image-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.project-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s ease;
}

.project-card:hover .project-image {
  transform: scale(1.04);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(7,8,15,0.92) 0%, rgba(7,8,15,0.2) 50%, transparent 100%);
  pointer-events: none;
}

.project-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-title-card {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: #fff;
  line-height: 1.1;
}

.project-desc-card {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.4;
  font-family: "JetBrains Mono", monospace;
  letter-spacing: 0.02em;
}

.project-stacks {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: flex-end;
  max-width: 50%;
}

.project-stack-badge {
  background: rgba(10,11,22,0.85);
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 5px 8px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.project-stack-logo {
  width: 14px;
  height: 14px;
  object-fit: contain;
  filter: brightness(0) invert(1) !important;
  opacity: 0.75;
}

.project-stack-name {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.62rem;
  color: rgba(255,255,255,0.65);
  letter-spacing: 0.04em;
}

.project-arrow {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 36px;
  height: 36px;
  background: rgba(123,92,240,0.2);
  border: 1px solid rgba(123,92,240,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-v);
  font-size: 1rem;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.25s, transform 0.25s;
}

.project-card:hover .project-arrow {
  opacity: 1;
  transform: scale(1);
}

/* Radial glow behind carousel */
.projects-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(123,92,240,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 768px) {
  .projects-glow { display: none; }
}
```

- [ ] **Step 2: Replace `src/components/sections/Projects.tsx`**

```tsx
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import projectsData from "../../data/projects.json";

type ProjectStack = { name: string; logo: string };
type Project = {
  slug: string; title: string; shortDescription: string;
  fullDescription: string; mainImage: string; gallery: string[];
  github: string | null; stacks: ProjectStack[];
};

const projects = (projectsData as { projects: Project[] }).projects;

function useWindowSize() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const handle = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}

export default function Projects() {
  const sectionRef  = useRef<HTMLElement | null>(null);
  const trackRef    = useRef<HTMLDivElement | null>(null);
  const { w, h }    = useWindowSize();

  const isMobile = w < 768;
  const CARD_W   = isMobile ? w * 0.82 : Math.min(w * 0.42, h * 0.82);
  const GAP      = isMobile ? 20 : 32;
  const PADDING  = isMobile ? 24 : Math.max(24, w * 0.06);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    const totalTrackWidth = projects.length * CARD_W + (projects.length - 1) * GAP;
    const scrollDistance  = totalTrackWidth - w + PADDING * 2;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollDistance + h * 0.5}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [w, h, CARD_W, GAP, PADDING]);

  return (
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="projects-glow" />

      <div className="projects-header">
        <h2 className="projects-title">Projets</h2>
        <span className="projects-count">
          {String(projects.length).padStart(2, "0")} réalisations
        </span>
      </div>

      <div className="projects-sticky">
        <div className="projects-viewport">
          <div
            ref={trackRef}
            className="projects-track"
            style={{
              gap: `${GAP}px`,
              paddingLeft: `${PADDING}px`,
              paddingRight: `${PADDING}px`,
            }}
          >
            {projects.map((project, index) => {
              // Arc effect: cards near center are flat, edges rotate and drop
              const normalizedIndex = (index / (projects.length - 1)) - 0.5; // -0.5 to +0.5
              const baseRotate = normalizedIndex * 6;
              const baseY = Math.abs(normalizedIndex) * (isMobile ? 0 : 60);

              return (
                <Link
                  key={project.slug}
                  to={`/project/${project.slug}`}
                  className="project-card"
                  style={{
                    width:  `${CARD_W}px`,
                    height: `${isMobile ? CARD_W * 1.2 : Math.min(CARD_W * 1.15, h * 0.72)}px`,
                    transform: `translateY(${baseY}px) rotate(${baseRotate}deg)`,
                    flexShrink: 0,
                  }}
                >
                  <div className="project-card-inner">
                    <div className="project-image-container">
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        className="project-image"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      />
                    </div>

                    <div className="project-overlay" />

                    {/* Stack badges */}
                    <div className="project-stacks">
                      {project.stacks.slice(0, 3).map((stack) => (
                        <div key={stack.name} className="project-stack-badge">
                          <img src={stack.logo} alt={stack.name} className="project-stack-logo" />
                          <span className="project-stack-name">{stack.name}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow */}
                    <div className="project-arrow">↗</div>

                    {/* Meta */}
                    <div className="project-meta">
                      <h3 className="project-title-card">{project.title}</h3>
                      <p className="project-desc-card">{project.shortDescription}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify in dev server**

```bash
npm run dev
```

Open `http://localhost:5173`. Expected: "PROJETS" title, cards laid out in an arc, scroll pins the section and slides cards horizontally. Cards have image, title, stack badges, arrow on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Projects.tsx src/style/_projects.css
git commit -m "feat: redesign Projects carousel with GSAP ScrollTrigger pin and arc layout"
```

---

## Task 9: AboutMe Redesign

**Files:**
- Modify: `src/components/sections/AboutMe.tsx`
- Modify: `src/style/_aboutMe.css`

- [ ] **Step 1: Replace `src/style/_aboutMe.css`**

```css
.about-section {
  position: relative;
  padding: 120px var(--px);
  background: var(--bg);
}

.about-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: start;
}

/* Left col — photo */
.about-photo-col {
  position: relative;
}

.about-photo-frame {
  position: relative;
  display: inline-block;
}

.about-photo {
  width: 100%;
  max-width: 420px;
  aspect-ratio: 3/4;
  object-fit: cover;
  object-position: center top;
  display: block;
  clip-path: polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%);
  filter: grayscale(15%);
  transition: filter 0.4s;
}

.about-photo:hover { filter: grayscale(0%); }

.about-photo-accent {
  position: absolute;
  top: -12px;
  left: -12px;
  right: 12px;
  bottom: 12px;
  border: 1px solid rgba(123,92,240,0.3);
  clip-path: polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%);
  pointer-events: none;
  z-index: -1;
}

/* Right col — text */
.about-text-col {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding-top: 16px;
}

.about-title {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(2.8rem, 5vw, 5rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: var(--fg);
}

.about-desc {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--fg-muted);
}

.about-desc a {
  color: var(--fg);
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 0.2s;
}

.about-desc a:hover { color: var(--accent-v); }

/* Timeline */
.about-timeline-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-a);
  margin-bottom: 28px;
}

.about-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-left: 32px;
}

.about-timeline-line {
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--border);
  transform-origin: top;
}

.about-timeline-line-fill {
  position: absolute;
  left: 0;
  top: 8px;
  width: 1px;
  height: 0%;
  background: linear-gradient(to bottom, var(--accent-v), var(--accent-a));
}

.about-timeline-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.about-timeline-dot {
  position: absolute;
  left: -38px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 2px solid var(--border);
  z-index: 1;
}

.about-timeline-dot--active {
  background: var(--accent-v);
  border-color: var(--accent-v);
  box-shadow: 0 0 12px rgba(123,92,240,0.5);
}

.about-timeline-school {
  font-family: "Clash Display", sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--fg);
}

.about-timeline-degree {
  font-size: 0.85rem;
  color: var(--fg-muted);
}

.about-timeline-date {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.08em;
  margin-top: 2px;
}

/* Responsive */
@media (max-width: 900px) {
  .about-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .about-photo { max-width: 100%; }
}
```

- [ ] **Step 2: Replace `src/components/sections/AboutMe.tsx`**

```tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";

export default function AboutMe() {
  const sectionRef  = useRef<HTMLElement | null>(null);
  const lineRef     = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section  = sectionRef.current;
      const lineFill = lineRef.current;
      if (!section || !lineFill) return;

      // Title slide in
      gsap.fromTo(
        section.querySelector(".about-title"),
        { x: -60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // Photo scale in
      gsap.fromTo(
        section.querySelector(".about-photo-frame"),
        { scale: 0.92, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.85, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none none" },
        }
      );

      // Desc + timeline label
      gsap.fromTo(
        [section.querySelector(".about-desc"), section.querySelector(".about-timeline-label")],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-text-col"), start: "top 82%", toggleActions: "play none none none" },
        }
      );

      // Timeline line draw
      gsap.fromTo(
        lineFill,
        { height: "0%" },
        {
          height: "100%", duration: 1.2, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-timeline"), start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // Timeline items stagger
      gsap.fromTo(
        section.querySelectorAll(".about-timeline-item"),
        { x: 20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-timeline"), start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // CV button
      gsap.fromTo(
        section.querySelector(".about-cv-btn"),
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".about-timeline"), start: "top 70%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="about-section">
      <div className="about-inner">
        {/* Left — Photo */}
        <div className="about-photo-col">
          <div className="about-photo-frame">
            <div className="about-photo-accent" />
            <img src={aathavanPhoto} alt="Aathavan Thevakumar" className="about-photo" />
          </div>
        </div>

        {/* Right — Text */}
        <div className="about-text-col">
          <h2 className="about-title">À Propos</h2>

          <p className="about-desc">
            Développeur fullstack en alternance chez{" "}
            <a href="https://xelians.fr/" target="_blank" rel="noopener noreferrer">Xelians</a>
            , actuellement en troisième année de BUT MMI à l'IUT de Marne-la-Vallée.
            Je conçois et développe des interfaces web modernes avec une attention
            particulière portée au design, à la performance et aux animations.
          </p>

          <div>
            <p className="about-timeline-label">Parcours</p>
            <div className="about-timeline">
              <div className="about-timeline-line" />
              <div ref={lineRef} className="about-timeline-line-fill" />

              <div className="about-timeline-item">
                <div className="about-timeline-dot about-timeline-dot--active" />
                <span className="about-timeline-school">IUT de Marne-la-Vallée</span>
                <span className="about-timeline-degree">BUT Métiers du Multimédia et de l'Internet</span>
                <span className="about-timeline-date">2023 — 2026</span>
              </div>

              <div className="about-timeline-item">
                <div className="about-timeline-dot" />
                <span className="about-timeline-school">Lycée Germaine Tillion</span>
                <span className="about-timeline-degree">Baccalauréat général — Mention Assez Bien</span>
                <span className="about-timeline-date">2020 — 2023</span>
              </div>
            </div>
          </div>

          <a
            href={monCV}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-amber about-cv-btn"
            style={{ alignSelf: "flex-start" }}
          >
            Voir mon CV
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/AboutMe.tsx src/style/_aboutMe.css
git commit -m "feat: redesign AboutMe with GSAP ScrollTrigger timeline draw animation"
```

---

## Task 10: Skills Section (New)

**Files:**
- Create: `src/data/skills.json`
- Create: `src/components/sections/Skills.tsx`
- Create: `src/style/_skills.css`

- [ ] **Step 1: Create `src/data/skills.json`**

```json
{
  "frontend": [
    { "name": "Angular",    "logo": "/logos/angular.svg" },
    { "name": "JavaScript", "logo": "/logos/javascript.svg" },
    { "name": "HTML",       "logo": "/logos/html.svg" },
    { "name": "CSS",        "logo": "/logos/css.svg" },
    { "name": "Tailwind",   "logo": "/logos/tailwind.svg" },
    { "name": "Bootstrap",  "logo": "/logos/bootstrap.svg" },
    { "name": "ChartJS",    "logo": "/logos/chartjs.svg" }
  ],
  "tools": [
    { "name": "PHP",        "logo": "/logos/php.svg" },
    { "name": "MySQL",      "logo": "/logos/mysql.svg" },
    { "name": "Figma",      "logo": "/logos/figma.svg" },
    { "name": "WordPress",  "logo": "/logos/wordpress.svg" },
    { "name": "GitHub",     "logo": "/logos/github.svg" }
  ],
  "stats": [
    { "value": 3,  "suffix": " ANS", "label": "d'études" },
    { "value": 6,  "suffix": "",     "label": "projets réalisés" },
    { "value": 2,  "suffix": "",     "label": "expériences Xelians" }
  ]
}
```

- [ ] **Step 2: Create `src/style/_skills.css`**

```css
.skills-section {
  position: relative;
  padding: 120px var(--px);
  background: var(--bg);
  overflow: hidden;
}

.skills-inner {
  max-width: var(--max-w);
  margin: 0 auto;
}

.skills-title {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(2.8rem, 5vw, 5rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: var(--fg);
  margin-bottom: 72px;
}

.skills-group {
  margin-bottom: 56px;
}

.skills-group-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-a);
  margin-bottom: 24px;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 12px;
  cursor: default;
  transition: border-color 0.25s, background 0.25s, transform 0.25s;
  will-change: transform;
}

.skill-item:hover {
  border-color: rgba(123,92,240,0.3);
  background: var(--surface-2);
  transform: translateY(-3px);
}

.skill-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
  filter: brightness(0) invert(1) !important;
  opacity: 0.8;
}

.skill-name {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  color: rgba(255,255,255,0.75);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* Stats */
.skills-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: 80px;
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  background: var(--border);
}

.skills-stat {
  background: var(--surface-1);
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skills-stat-value {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  color: var(--fg);
  line-height: 1;
  letter-spacing: -0.04em;
}

.skills-stat-value span {
  color: var(--accent-v);
}

.skills-stat-label {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  color: var(--fg-muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .skills-stats { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Create `src/components/sections/Skills.tsx`**

```tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import skillsData from "../../data/skills.json";

type Skill = { name: string; logo: string };
type StatData = { value: number; suffix: string; label: string };
type SkillsData = {
  frontend: Skill[];
  tools: Skill[];
  stats: StatData[];
};

const data = skillsData as SkillsData;

export default function Skills() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const statRefs   = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // Title
      gsap.fromTo(
        section.querySelector(".skills-title"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
        }
      );

      // Skill items wave
      gsap.fromTo(
        section.querySelectorAll(".skill-item"),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".skills-group"), start: "top 82%", toggleActions: "play none none none" },
        }
      );

      // Stats countup
      data.stats.forEach((stat, i) => {
        const el = statRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.5,
          ease: "power2.out",
          snap: { val: 1 },
          scrollTrigger: {
            trigger: section.querySelector(".skills-stats"),
            start: "top 85%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val)) + stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <div className="skills-inner">
        <h2 className="skills-title">Compétences</h2>

        <div className="skills-group">
          <p className="skills-group-label">Frontend & Frameworks</p>
          <div className="skills-grid">
            {data.frontend.map((skill) => (
              <div key={skill.name} className="skill-item">
                <img src={skill.logo} alt={skill.name} className="skill-logo" />
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-group">
          <p className="skills-group-label">Outils & Autres</p>
          <div className="skills-grid">
            {data.tools.map((skill) => (
              <div key={skill.name} className="skill-item">
                <img src={skill.logo} alt={skill.name} className="skill-logo" />
                <span className="skill-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-stats">
          {data.stats.map((stat, i) => (
            <div key={stat.label} className="skills-stat">
              <span className="skills-stat-value">
                <span
                  ref={(el) => { statRefs.current[i] = el; }}
                >
                  0{stat.suffix}
                </span>
              </span>
              <span className="skills-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/data/skills.json src/components/sections/Skills.tsx src/style/_skills.css
git commit -m "feat: add Skills section with GSAP wave animation and countup stats"
```

---

## Task 11: Experience Redesign

**Files:**
- Modify: `src/components/sections/Experience.tsx`
- Modify: `src/style/_experience.css`

- [ ] **Step 1: Replace `src/style/_experience.css`**

```css
.experience-section {
  padding: 120px var(--px);
  background: var(--bg);
}

.experience-inner {
  max-width: var(--max-w);
  margin: 0 auto;
}

.experience-title {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(2.8rem, 5vw, 5rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: var(--fg);
  margin-bottom: 72px;
}

.experience-stack {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-width: 860px;
}

.experience-card {
  position: relative;
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 40px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.experience-card:hover {
  border-color: rgba(123,92,240,0.2);
}

/* Ghost number */
.experience-card-num {
  position: absolute;
  top: -10px;
  right: 24px;
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: 7rem;
  color: rgba(255,255,255,0.03);
  line-height: 1;
  pointer-events: none;
  user-select: none;
  letter-spacing: -0.04em;
}

.experience-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.experience-company {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: 1.4rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--fg);
}

.experience-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: brightness(0) invert(1) !important;
  opacity: 0.7;
  flex-shrink: 0;
}

.experience-roles {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.experience-role {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.experience-role-marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-v);
  margin-top: 7px;
  flex-shrink: 0;
}

.experience-role-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.experience-role-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.experience-role-title {
  font-family: "Clash Display", sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--fg);
}

.experience-role-period {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  color: var(--accent-a);
  letter-spacing: 0.08em;
}

.experience-role-description {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--fg-muted);
}
```

- [ ] **Step 2: Replace `src/components/sections/Experience.tsx`**

```tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import experienceData from "../../data/experience.json";

type ExperiencePosition = { title: string; period: string; description: string };
type ExperienceItem = { id: number; company: string; logo: string; positions: ExperiencePosition[] };

const experiences = (experienceData as { experiences: ExperienceItem[] }).experiences;

export default function Experience() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelector(".experience-title"),
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 82%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        section.querySelectorAll(".experience-card"),
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, stagger: 0.18, ease: "power2.out",
          scrollTrigger: { trigger: section.querySelector(".experience-stack"), start: "top 85%", toggleActions: "play none none none" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="experience-section">
      <div className="experience-inner">
        <h2 className="experience-title">Expériences</h2>

        <div className="experience-stack">
          {experiences.map((exp, index) => (
            <article key={exp.id} className="experience-card">
              <span className="experience-card-num" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="experience-card-header">
                <h3 className="experience-company">{exp.company}</h3>
                <img
                  src={exp.logo}
                  alt={exp.company}
                  className="experience-logo"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>

              <div className="experience-roles">
                {exp.positions.map((pos, pi) => (
                  <div key={pi} className="experience-role">
                    <div className="experience-role-marker" />
                    <div className="experience-role-body">
                      <div className="experience-role-header">
                        <h4 className="experience-role-title">{pos.title}</h4>
                        <span className="experience-role-period">{pos.period}</span>
                      </div>
                      <p className="experience-role-description">{pos.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Experience.tsx src/style/_experience.css
git commit -m "feat: redesign Experience with editorial cards and GSAP stagger reveal"
```

---

## Task 12: Contact Redesign

**Files:**
- Modify: `src/components/sections/Contact.tsx`
- Modify: `src/style/_contact.css`

- [ ] **Step 1: Replace `src/style/_contact.css`**

```css
.contact-section {
  position: relative;
  padding: 120px var(--px) 80px;
  background: var(--bg);
  text-align: center;
  overflow: hidden;
}

/* Radial amber glow */
.contact-section::before {
  content: "";
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.contact-inner {
  position: relative;
  z-index: 1;
  max-width: var(--max-w);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.contact-title-wrap {
  overflow: hidden;
}

.contact-title {
  font-family: "Clash Display", sans-serif;
  font-weight: 700;
  font-size: clamp(3rem, 8vw, 8rem);
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.9;
  color: var(--fg);
  display: block;
}

.contact-email-wrap {
  position: relative;
  display: inline-block;
}

.contact-email {
  font-family: "Clash Display", sans-serif;
  font-weight: 600;
  font-size: clamp(1rem, 2.5vw, 1.8rem);
  color: var(--fg);
  text-decoration: none;
  letter-spacing: -0.01em;
  position: relative;
  display: inline-block;
  transition: color 0.2s;
}

.contact-email::after {
  content: "";
  position: absolute;
  bottom: -3px;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--accent-a);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.contact-email:hover { color: var(--accent-a); }
.contact-email:hover::after { transform: scaleX(1); }

.contact-socials {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-social-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 9999px;
  border: 1px solid var(--border);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.2s;
}

.contact-social-btn:hover {
  border-color: rgba(255,255,255,0.2);
  color: var(--fg);
  background: rgba(255,255,255,0.05);
  transform: translateY(-2px);
}

.contact-social-btn img {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1) !important;
  opacity: 0.65;
  transition: opacity 0.25s;
}

.contact-social-btn:hover img { opacity: 1; }
```

- [ ] **Step 2: Replace `src/components/sections/Contact.tsx`**

```tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const emailRef   = useRef<HTMLAnchorElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const email   = emailRef.current;
      if (!section) return;

      // Title lines reveal
      const lines = section.querySelectorAll<HTMLElement>(".contact-title");
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0, duration: 0.9, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      // Email + socials
      gsap.fromTo(
        [section.querySelector(".contact-email-wrap"), section.querySelector(".contact-socials")],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none none" },
        }
      );

      // Magnetic effect on email button
      if (email) {
        const handleMove = (e: MouseEvent) => {
          const rect = email.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.25;
          const dy = (e.clientY - cy) * 0.25;
          gsap.to(email, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
        };
        const handleLeave = () => {
          gsap.to(email, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        };
        email.addEventListener("mousemove", handleMove);
        email.addEventListener("mouseleave", handleLeave);
        return () => {
          email.removeEventListener("mousemove", handleMove);
          email.removeEventListener("mouseleave", handleLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact-section">
      <div className="contact-inner">
        <div>
          <div className="contact-title-wrap">
            <span className="contact-title">Travaillons</span>
          </div>
          <div className="contact-title-wrap">
            <span className="contact-title">Ensemble</span>
          </div>
        </div>

        <div className="contact-email-wrap">
          <a
            ref={emailRef}
            href="mailto:aathavanthevakumar@gmail.com"
            className="contact-email"
          >
            aathavanthevakumar@gmail.com
          </a>
        </div>

        <div className="contact-socials">
          <a
            href="https://www.linkedin.com/in/aathavanthevakumar/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-btn"
          >
            <img src="/logos/linkedin.svg" alt="" />
            LinkedIn
          </a>
          <a
            href="https://github.com/Athavv"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-btn"
          >
            <img src="/logos/github.svg" alt="" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Contact.tsx src/style/_contact.css
git commit -m "feat: redesign Contact with oversized title reveal and magnetic email"
```

---

## Task 13: Home Page Assembly

**Files:**
- Modify: `src/pages/Home.tsx`

- [ ] **Step 1: Replace `src/pages/Home.tsx`**

```tsx
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Hero from "../components/sections/Hero";
import Projects from "../components/sections/Projects";
import AboutMe from "../components/sections/AboutMe";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main>
        <Projects />
        <AboutMe />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Full visual check in dev server**

```bash
npm run dev
```

Open `http://localhost:5173`. Scroll through:
- Hero: curtain reveal, name cascades, floating cards ✓
- Projects: section pins, cards scroll horizontally in arc ✓
- About: photo + timeline draw ✓
- Skills: wave in + countup stats ✓
- Experience: cards stagger in ✓
- Contact: title reveal + magnetic email ✓
- Footer: name + credit ✓

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: assemble Home page with new section order (Hero → Projects → About → Skills → Experience → Contact)"
```

---

## Task 14: Cleanup — Remove Old Components

**Files to delete:**
- `src/components/IntroSunrise.tsx`
- `src/components/StarField.tsx`
- `src/components/Moon.tsx`
- `src/components/layouts/ScrollBackdrop.tsx`
- `src/components/animations/BlurIn.tsx`
- `src/style/_introSunrise.css`
- `src/style/_scrollBackdrop.css`

- [ ] **Step 1: Delete old component files**

```bash
rm src/components/IntroSunrise.tsx \
   src/components/StarField.tsx \
   src/components/Moon.tsx \
   src/components/layouts/ScrollBackdrop.tsx \
   src/components/animations/BlurIn.tsx \
   src/style/_introSunrise.css \
   src/style/_scrollBackdrop.css
```

- [ ] **Step 2: Verify build after deletion**

```bash
npm run build
```

Expected: exits 0. These files are no longer imported anywhere (App.tsx was replaced in Task 2 and no longer references them).

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove old IntroSunrise, StarField, Moon, ScrollBackdrop, BlurIn components"
```

---

## Task 15: Final Polish + Build Verification

- [ ] **Step 1: Check for any `filter: brightness(0)` conflicts**

The old `custom.css` had a global rule forcing all SVGs to black:
```css
img[src$=".svg"], svg { filter: brightness(0); }
```
This rule no longer exists (custom.css was replaced in Task 1). Verify logos appear correctly (white/inverted) in dev server. If any SVG appears incorrectly colored, add `filter: brightness(0) invert(1) !important` to its specific CSS class.

- [ ] **Step 2: Check mobile layout**

Open dev tools, test at 375px width:
- Hero: single column, photo above text, no hero-card-3 ✓
- Projects: cards at 82vw, horizontal scroll ✓
- About: single column ✓
- Skills stats: single column ✓

- [ ] **Step 3: Check `prefers-reduced-motion`**

Add to `src/index.css` at the end:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Final build**

```bash
npm run build
```

Expected: exits 0, no errors. Note the bundle size output.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete portfolio redesign — Hybrid Editorial with GSAP ScrollTrigger"
```
