import React from "react"
import aathavanPhoto from "../../assets/aathavan_thevakumar.jpg"
import monCV from "../../assets/Aathavan_Thevakumar_CV-ALTERNANCE.pdf"

function AboutMe() {
  return (
    <section id="about" className="about-me-section">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="section-title">About me</h2>

        <div className="about-container">
          <div className="about-col image-col">
            <div className="photo-wrapper">
              <img src={aathavanPhoto} alt="Aathavan Thevakumar" className="photo-img" />
            </div>
          </div>

          <div className="about-col text-col">
            <p className="text-desc">
              Bienvenue sur mon Portfolio ! <br /><br />
              Je suis un développeur fullstack, actuellement en alternance chez{" "}
              <a
                href="https://xelians.fr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline hover:text-purple-400 transition-colors font-bold"
              >
                Xelians
              </a>{" "}
              dans le cadre de ma troisième année de BUT MMI (Métiers du Multimédia et de l'Internet). <br /><br />
              Dans ce portfolio vous allez pouvoir retrouver certains projets que j'ai réalisés, que ce soit dans le cadre de mes études ou durant mon temps libre.
            </p>

            <div className="timeline-section">
              <h3 className="parcours">Mon parcours</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-dot current"></div>
                  <div className="timeline-content">
                    <h4 className="school">IUT DE MARNE LA VALLÉE</h4>
                    <span className="location">Site de Meaux</span>
                    <p className="degree">BUT Métiers du Multimédia et de l'Internet</p>
                  </div>
                  <div className="timeline-date">2023 - 2026</div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <h4 className="school">LYCÉE GERMAINE TILLION</h4>
                    <p className="degree">Baccalauréat général</p>
                    <span className="mention">Mention Assez Bien</span>
                  </div>
                  <div className="timeline-date">2020 - 2023</div>
                </div>
              </div>
            </div>

            <div className="btn-container">
              <a href={monCV} target="_blank" rel="noopener noreferrer">
                <button className="moon-btn">Voir mon CV</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMe