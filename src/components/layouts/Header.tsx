import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const sectionItems = [
    { label: "Accueil", href: "#hero" },
    { label: "À propos", href: "#about" },
    { label: "Expériences", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="site-header">
      <div className="header-pill">
        <Link to="/" className="header-brand">
          <span className="header-brand-mark">AT</span>
          <span className="header-brand-text">Aathavan</span>
        </Link>

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
