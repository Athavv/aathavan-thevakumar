import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import IntroSunrise from "./components/IntroSunrise.tsx";
import Home from "./pages/Home.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import StarField from "./components/StarField.tsx";
import { gsap } from "gsap";

function SunRouteTransition() {
  const location = useLocation();

  useEffect(() => {
    const el = document.querySelector<HTMLDivElement>("#route-sun");
    if (!el) return;

    gsap.fromTo(
      el,
      { scale: 0, opacity: 0, y: 40 },
      {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(el, {
            scale: 0.65,
            opacity: 0,
            y: -20,
            duration: 0.45,
            delay: 0.1,
            ease: "power2.in",
          });
        },
      },
    );
  }, [location.pathname]);

  return (
    <div
      id="route-sun"
      className="pointer-events-none fixed left-1/2 top-6 z-[70] h-10 w-10 -translate-x-1/2 rounded-full"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, #fff7c8 0%, #ffdd55 45%, #ff9900 100%)",
        boxShadow:
          "0 0 18px rgba(255, 180, 50, 0.5), 0 0 40px rgba(255, 180, 50, 0.25)",
        transformOrigin: "center",
      }}
    />
  );
}

export default function App() {
  const [doneIntro, setDoneIntro] = useState<boolean>(false);

  useEffect(() => {
    const hasSeenIntro = window.localStorage.getItem("intro-sunrise-done");
    const hasHash = window.location.hash && window.location.hash !== "";
    if (hasSeenIntro === "true" || hasHash) {
      setDoneIntro(true);
    }
  }, []);

  const handleIntroFinish = () => {
    window.localStorage.setItem("intro-sunrise-done", "true");
    setDoneIntro(true);
  };

  return (
    <Router>
      <div className="relative min-h-screen bg-white">
        <StarField
          color="rgba(0,0,0,0.95)"
          background="#ffffff"
          starCount={260}
        />
        {!doneIntro && <IntroSunrise onFinish={handleIntroFinish} />}
        {doneIntro && <SunRouteTransition />}
        {doneIntro && (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}
