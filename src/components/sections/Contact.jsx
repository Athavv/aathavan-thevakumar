import React from "react"
import BlurIn from "../animations/BlurIn"

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="max-w-[1100px] mx-auto w-full contact-container">
        <BlurIn delay={0.2}>
          <h2 className="section-title">Contact</h2>
        </BlurIn>

        <BlurIn delay={0.4}>
          <div className="infos-contact">
            <a href="mailto:aathavanthevakumar@gmail.com" id="mail">
              aathavanthevakumar@gmail.com
            </a>

            <ul>
              <li>
                <a
                  href="https://www.linkedin.com/in/aathavanthevakumar/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <img src="/logos/linkedin.svg" alt="LinkedIn" loading="lazy" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Athavv"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <img src="/logos/tools/github.svg" alt="GitHub" loading="lazy" />
                </a>
              </li>
            </ul>
          </div>
        </BlurIn>
      </div>
    </section>
  )
}

export default Contact
