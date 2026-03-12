import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastScrollY.current;
      if (y > 80 && diff > 4) {
        setHidden(true);
      } else if (diff < -4) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sectionItems = [
    { label: "Accueil", href: "#hero" },
    { label: "À propos", href: "#about" },
    { label: "Expériences", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className={`site-header ${hidden ? "site-header--hidden" : ""}`}>
      <div className="header-pill">
        <Link to="/" className="header-brand" aria-label="Accueil" />

        <nav className="header-nav">
          {sectionItems.map((item) =>
            isHome ? (
              <a key={item.label} href={item.href} className="header-link">
                {item.label}
              </a>
            ) : (
              <a
                key={item.label}
                href={`/${item.href}`}
                className="header-link"
              >
                {item.label}
              </a>
            ),
          )}

          <Link
            to="/projects"
            className={`header-link header-link-cta ${location.pathname === "/projects" ? "header-link-active" : ""}`}
          >
            Mes projets
          </Link>
        </nav>
      </div>
      <div className="header-glow" />
    </header>
  );
}
