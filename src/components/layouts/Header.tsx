import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Projets",     href: "/#projects",    num: "01" },
  { label: "À propos",   href: "/#about",        num: "02" },
  { label: "Skills",     href: "/#skills",       num: "03" },
  { label: "Expérience", href: "/#experience",   num: "04" },
  { label: "Contact",    href: "/#contact",      num: "05" },
];

function MagneticLink({ href, num, label, active, onClick }: {
  href: string; num: string; label: string; active: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) * 0.25;
    const dy = (e.clientY - rect.top  - rect.height / 2) * 0.25;
    gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: "power2.out" });
  };
  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1,0.4)" });
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`hdr-link${active ? " hdr-link--active" : ""}`}
    >
      <span className="hdr-link-num">{num}</span>
      <span className="hdr-link-label">{label}</span>
      <span className="hdr-link-bar" aria-hidden="true" />
    </a>
  );
}

export default function Header() {
  const [hidden,    setHidden]    = useState(false);
  const [dark,      setDark]      = useState(true);   // true = on dark hero
  const [activeIdx, setActiveIdx] = useState(-1);
  const lastScrollY = useRef(0);
  const location    = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > lastScrollY.current && y > 160);
      // Switch to "light" mode once past hero (~100vh)
      setDark(y < window.innerHeight * 0.4);
      lastScrollY.current = y;

      const ids = ["projects", "about", "skills", "experience", "contact"];
      let found = -1;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          found = i; break;
        }
      }
      setActiveIdx(found);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      document.getElementById(href.slice(2))?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className={[
      "hdr",
      hidden ? "hdr--hidden" : "",
      dark   ? "hdr--dark"   : "hdr--light",
    ].filter(Boolean).join(" ")}>

      {/* Brand */}
      <Link to="/" className="hdr-brand">
        <span className="hdr-brand-sun" aria-hidden="true" />
        <span className="hdr-brand-name">
          <span className="hdr-brand-first">Aathavan</span>
          <span className="hdr-brand-last">Thevakumar</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="hdr-nav" aria-label="Navigation">
        {NAV_LINKS.map(({ label, href, num }, i) => (
          <MagneticLink
            key={href}
            href={href}
            num={num}
            label={label}
            active={activeIdx === i}
            onClick={(e) => handleAnchor(e, href)}
          />
        ))}
      </nav>

      {/* CV */}
      <a href={monCV} target="_blank" rel="noopener noreferrer" className="hdr-cv">
        <span className="hdr-cv-text">CV</span>
        <svg className="hdr-cv-icon" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
          <path d="M1.5 9.5 9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </header>
  );
}
