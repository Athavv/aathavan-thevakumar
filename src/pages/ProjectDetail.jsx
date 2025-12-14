import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import projectsData from "../data/projects.json"
import "../style/_projectDetail.css"
import Header from "../components/layouts/Header"

function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const galleryRef = useRef(null)
  const descriptionRef = useRef(null)

  useEffect(() => {
    const foundProject = projectsData.projects.find((p) => p.slug === slug)
    if (foundProject) {
      setProject(foundProject)
    }
    setLoading(false)
  }, [slug])

  useEffect(() => {
    if (!project || !galleryRef.current || !descriptionRef.current) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const descriptionTop = descriptionRef.current.offsetTop
      const descriptionHeight = descriptionRef.current.offsetHeight

      if (scrollY >= descriptionTop - windowHeight / 2) {
        const progress = Math.min(
          (scrollY - descriptionTop + windowHeight / 2) / descriptionHeight,
          1
        )
        const images = galleryRef.current.querySelectorAll("img")
        images.forEach((img, index) => {
          const offset = (index + 1) * 80
          const translateY = progress * offset
          img.style.transform = `translateY(${translateY}px)`
          img.style.opacity = 1 - progress * 0.2
        })
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [project])

  if (loading) {
    return (
      <>
        <Header />
        <div className="project-detail-loading">
          <div className="loading-text">Chargement...</div>
        </div>
      </>
    )
  }

  if (!project) {
    return (
      <>
        <Header />
        <div className="project-detail-loading">
          <div className="project-not-found">
            <h1 className="not-found-title">Projet non trouvé</h1>
            <button onClick={() => navigate(-1)} className="back-link">
              Retour
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="project-detail">
        <div className="project-content">
          {/* Bouton retour en haut à gauche */}
          <button onClick={() => navigate(-1)} className="back-button-top">
            <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>

          {/* Section titre et stacks */}
          <div className="project-intro">
            {/* Titre à gauche */}
            <div className="title-section">
              <h1 className="project-title">{project.title}</h1>
            </div>

            {/* Stacks et infos à droite */}
            <div className="info-section">
              {/* SVG des stacks */}
              <div className="stacks-container">
                {project.stacks.map((stack, index) => (
                  <div key={index} className="stack-item" title={stack.name}>
                    <img
                      src={stack.logo}
                      alt={stack.name}
                      className="stack-logo"
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.nextSibling.style.display = "flex"
                      }}
                    />
                    <span className="stack-fallback">{stack.name}</span>
                  </div>
                ))}
              </div>

              {/* Mini descriptif */}
              <p className="short-description">{project.shortDescription}</p>

              {/* Bouton voir code */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-button"
                >
                  <svg className="github-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.186.092-.923.35-1.544.637-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.192 20 14.436 20 10.017 20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Voir le code
                </a>
              )}
            </div>
          </div>

          {/* Image principale */}
          <div className="main-image-container">
            <img
              src={project.mainImage}
              alt={project.title}
              className="main-image"
              onError={(e) => {
                e.target.style.display = "none"
                e.target.parentElement.innerHTML = '<div class="image-placeholder">Image principale</div>'
              }}
            />
          </div>

          {/* Section description sticky et galerie */}
          <div className="description-gallery-section">
            {/* Description sticky à gauche */}
            <div className="description-container">
              <div ref={descriptionRef} className="description-content">
                <h2 className="description-title">Description</h2>
                <p className="description-text">{project.fullDescription}</p>
              </div>
            </div>

            {/* Galerie qui scroll à droite */}
            <div ref={galleryRef} className="gallery-container">
              {project.gallery.map((image, index) => (
                <div key={index} className="gallery-item">
                  <img
                    src={image}
                    alt={`${project.title} - Screenshot ${index + 1}`}
                    className="gallery-image"
                    onError={(e) => {
                      e.target.style.display = "none"
                      e.target.parentElement.innerHTML = `<div class="image-placeholder">Image ${index + 1}</div>`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProjectDetail