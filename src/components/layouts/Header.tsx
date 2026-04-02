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
