import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

export default function Hero() {
  const author = "Aathavan Thevakumar";
  const [firstName, lastName] = author.split(" ");

  const firstNameRef = useRef<HTMLHeadingElement | null>(null);
  const lastNameRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLHeadingElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleShadowRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const firstEl = firstNameRef.current;
      const lastEl = lastNameRef.current;
      const subtitleEl = subtitleRef.current;
      const titleShadowEl = titleShadowRef.current;

      if (!firstEl || !lastEl || !subtitleEl || !titleShadowEl) return;

      const firstLetters =
        firstEl.querySelectorAll<HTMLElement>(".name-letter");
      const lastLetters = lastEl.querySelectorAll<HTMLElement>(".name-letter");
      const subtitleLetters =
        subtitleEl.querySelectorAll<HTMLElement>(".letter");
      const shadowLines =
        titleShadowEl.querySelectorAll<HTMLElement>(".hero-title");
      const lead = sectionRef.current?.querySelector<HTMLElement>(".hero-lead");
      const actions =
        sectionRef.current?.querySelector<HTMLElement>(".hero-actions");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set([...firstLetters, ...lastLetters], {
        yPercent: 110,
        rotate: 4,
        opacity: 0,
      })
        .set(subtitleLetters, { y: 14, opacity: 0 })
        .set([lead, actions], { y: 24, opacity: 0 })
        .fromTo(
          shadowLines,
          { y: 36, opacity: 0 },
          {
            y: 8,
            opacity: 0.15,
            duration: 0.9,
            stagger: 0.08,
          },
          0,
        )
        .to(
          [...firstLetters, ...lastLetters],
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.035,
            ease: "expo.out",
          },
          0.08,
        )
        .to(
          subtitleLetters,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.018,
          },
          0.35,
        )
        .to(
          [lead, actions],
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
          },
          0.5,
        );

      gsap.to([firstEl, lastEl], {
        y: -4,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} className="letter inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const splitName = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="name-letter inline-block origin-bottom will-change-[transform,opacity]"
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="pointer-events-none relative flex min-h-screen w-full items-center overflow-hidden"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1180px] items-center justify-center px-[clamp(20px,5vw,60px)] py-24 text-left max-[757px]:px-[clamp(22px,6vw,60px)] max-[757px]:py-[120px]">
        <div className="hero-content-wrapper pointer-events-auto mr-auto flex w-full max-w-[760px] flex-col items-start gap-7 text-left max-[757px]:mr-0 max-[757px]:items-center max-[757px]:text-center">
          <div className="relative inline-block overflow-hidden">
            <div
              ref={titleShadowRef}
              className="absolute left-0 top-0 z-1 translate-x-2 translate-y-2 text-white opacity-15"
            >
              <h1 className="hero-title font-['Space_Grotesk'] text-[clamp(3.2rem,6.4vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em]">
                {firstName}
              </h1>
              <h1 className="hero-title font-['Space_Grotesk'] text-[clamp(3.2rem,6.4vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em]">
                {lastName}
              </h1>
            </div>

            <div>
              <h1
                ref={firstNameRef}
                className="hero-title relative z-2 font-['Space_Grotesk'] text-[clamp(3.2rem,6.4vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white [text-shadow:0_0_40px_rgba(255,255,255,0.35)]"
              >
                {splitName(firstName)}
              </h1>
              <h1
                ref={lastNameRef}
                className="hero-title relative z-2 font-['Space_Grotesk'] text-[clamp(3.2rem,6.4vw,6rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white [text-shadow:0_0_40px_rgba(255,255,255,0.35)]"
              >
                {splitName(lastName)}
              </h1>
            </div>
          </div>

          <h3
            ref={subtitleRef}
            className="relative text-[1.05rem] font-semibold uppercase tracking-[0.18em] text-white/70"
          >
            {splitText("Développeur Full Stack")}
          </h3>

          <p className="hero-lead max-w-[66ch] text-[1.1rem] leading-[1.7] text-white/80 max-[967px]:text-[1.05rem] max-[537px]:text-[1rem]">
            Je conçois et développe des expériences web modernes, performantes
            et accessibles. Ici, tu trouveras une sélection de projets (études &
            perso) et mon parcours.
          </p>

          <div className="hero-actions flex flex-wrap items-center gap-3 max-[757px]:justify-center">
            <Link
              to="/projects"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(255,180,50,0.22)] bg-[rgba(255,180,50,0.14)] px-[18px] py-3 font-semibold text-black backdrop-blur-[10px] transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-[rgba(255,180,50,0.3)] hover:bg-[rgba(255,180,50,0.18)] max-[450px]:w-full"
            >
              Voir mes projets
            </Link>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-[18px] py-3 font-semibold text-white backdrop-blur-[10px] transition-[background,border-color,transform] duration-200 hover:-translate-y-px hover:border-white/25 hover:bg-white/20 max-[450px]:w-full"
            >
              Me contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
