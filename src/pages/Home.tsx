import Hero from "../components/sections/Hero.tsx";
import AboutMe from "../components/sections/AboutMe.tsx";
import Projects from "../components/sections/Projects.tsx";
import Experience from "../components/sections/Experience.tsx";
import Contact from "../components/sections/Contact.tsx";
import Header from "../components/layouts/Header.tsx";
import ScrollBackdrop from "../components/layouts/ScrollBackdrop";

export default function Home() {
  return (
    <>
      <Header />
      <div className="relative h-[calc(100vh+420px)]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <ScrollBackdrop>
            <Hero />
          </ScrollBackdrop>
        </div>
      </div>
      <main className="relative z-1 bg-white">
        <AboutMe />
        <Projects />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
