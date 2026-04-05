import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import ScrollBackdrop from "../components/layouts/ScrollBackdrop";
import Hero from "../components/sections/Hero";
import AboutMe from "../components/sections/AboutMe";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Contact from "../components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />

      {/* Hero wrapped in ScrollBackdrop — extra 500px dead zone creates pause at end */}
      <div className="relative" style={{ height: "calc(100vh + 1400px)" }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          <ScrollBackdrop>
            <Hero />
          </ScrollBackdrop>
        </div>
      </div>

      <main className="relative z-10" style={{ background: "var(--bg)" }}>
        <AboutMe />
        <Projects />
        <Skills />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
