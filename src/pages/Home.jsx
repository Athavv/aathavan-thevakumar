import React from "react"
import Hero from "../components/sections/Hero"
import AboutMe from "../components/sections/AboutMe"
import Projects from "../components/sections/Projects"
import Skills from "../components/sections/Skills"
import Experience from "../components/sections/Experience"
import Contact from "../components/sections/Contact"
import Header from "../components/layouts/Header"

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <AboutMe />
      <Projects />
      <Skills />
      <Experience />
      <Contact />
    </>
  )
}

export default Home