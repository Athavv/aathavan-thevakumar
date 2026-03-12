import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IntroSunrise from "./components/IntroSunrise.tsx";
import Home from "./pages/Home.tsx";
import ProjectDetail from "./pages/ProjectDetail.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";

export default function App() {
  const [doneIntro, setDoneIntro] = useState<boolean>(false);

  return (
    <Router>
      <div>
        {!doneIntro && <IntroSunrise onFinish={() => setDoneIntro(true)} />}
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
