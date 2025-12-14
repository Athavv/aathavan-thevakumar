import React from "react";
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg";

function AboutMe() {
  return (
    <section
      id="about"
      className="about-me-section relative w-full bg-black px-[clamp(20px,5vw,60px)] py-20"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <div className="max-w-[1100px] mx-auto">
        <h2 className="section-title text-5xl md:text-6xl font-title text-white mb-16 text-left">
          About me
        </h2>

        <div className="about-container" style={{ marginTop: '50px', marginBottom: '200px' }}>
          
          <div className="about-col image-col">
            <div className="photo-wrapper"> 
              <img
                src={aathavanPhoto}
                alt="Aathavan Thevakumar"
                className="photo-img" 
              />
            </div>
          </div>

          <div className="about-col text-col">
            <p className="text-white text-lg leading-relaxed mb-4 text-desc">
              Bienvenue sur mon Portfolio ! <br />
              <br />
              Je suis un développeur fullstack, actuellement en alternance chez{" "}
              <a
                href="https://xelians.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline hover:text-purple-400 transition-colors font-bold"
              >
                Xelians
              </a>{" "}
              dans le cadre de ma troisième année de BUT MMI (Métiers du Multimédia et de
              l'Internet). <br />
              <br />
              Dans ce portfolio vous allez pouvoir retrouver certains projets que j'ai réalisés,
              que ce soit dans le cadre de mes études ou durant mon temps libre.
            </p>

            <div className="btn-container">
              <a
                href="https://drive.google.com/file/d/1vjtWfqYGMIMK_rlBnmDEpKco9MiEaQss/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="moon-btn">
                  Voir mon CV
                </button>
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default AboutMe;