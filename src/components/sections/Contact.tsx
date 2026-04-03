import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const emailRef   = useRef<HTMLAnchorElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const email   = emailRef.current;
      if (!section) return;

      gsap.fromTo(
        section.querySelectorAll<HTMLElement>(".contact-title"),
        { yPercent: 110 },
        {
          yPercent: 0, duration: 0.9, stagger: 0.1, ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
        }
      );

      gsap.fromTo(
        [section.querySelector(".contact-email-wrap"), section.querySelector(".contact-socials")],
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 70%", toggleActions: "play none none none" },
        }
      );

      if (email) {
        const handleMove = (e: MouseEvent) => {
          const rect = email.getBoundingClientRect();
          const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.25;
          const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.25;
          gsap.to(email, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
        };
        const handleLeave = () => {
          gsap.to(email, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        };
        email.addEventListener("mousemove", handleMove);
        email.addEventListener("mouseleave", handleLeave);
        return () => {
          email.removeEventListener("mousemove", handleMove);
          email.removeEventListener("mouseleave", handleLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="contact-section">
      <div className="contact-inner">
        <div>
          <div className="contact-title-wrap">
            <span className="contact-title">Travaillons</span>
          </div>
          <div className="contact-title-wrap">
            <span className="contact-title">Ensemble</span>
          </div>
        </div>

        <div className="contact-email-wrap">
          <a
            ref={emailRef}
            href="mailto:aathavanthevakumar@gmail.com"
            className="contact-email"
          >
            aathavanthevakumar@gmail.com
          </a>
        </div>

        <div className="contact-socials">
          <a
            href="https://www.linkedin.com/in/aathavanthevakumar/"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-btn"
          >
            <img src="/logos/linkedin.svg" alt="" aria-hidden="true" />
            LinkedIn
          </a>
          <a
            href="https://github.com/Athavv"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social-btn"
          >
            <img src="/logos/github.svg" alt="" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
