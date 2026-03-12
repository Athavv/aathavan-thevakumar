import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import projectsData from "../data/projects.json"
import Header from "../components/layouts/Header.tsx"

type ProjectStack = {
  name: string
  logo: string
}

type Project = {
  slug: string
  title: string
  shortDescription: string
  fullDescription: string
  mainImage: string
  gallery: string[]
  github: string | null
  stacks: ProjectStack[]
}

type ProjectsData = {
  projects: Project[]
}

export default function ProjectsPage() {
  const typedData = projectsData as ProjectsData
  const projects = typedData.projects || []

  const allStacks = useMemo(() => {
    const names = new Set<string>()
    projects.forEach((p) => p.stacks.forEach((s) => names.add(s.name)))
    return Array.from(names).sort((a, b) => a.localeCompare(b))
  }, [projects])

  const [query, setQuery] = useState<string>("")
  const [stackFilter, setStackFilter] = useState<string>("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.fullDescription.toLowerCase().includes(q)

      const matchesStack = !stackFilter || p.stacks.some((s) => s.name === stackFilter)

      return matchesQuery && matchesStack
    })
  }, [projects, query, stackFilter])

  return (
    <>
      <Header />
      <main className="min-h-screen px-[clamp(24px,6vw,64px)] pt-32 pb-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-10">
            <h1 className="font-display text-white text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
              Mes projets
            </h1>
            <p className="mt-4 text-white/70 font-body max-w-[70ch]">
              Une sélection de projets académiques et personnels. Recherche, filtre par techno, puis ouvre la fiche pour
              voir la description et la galerie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6 mb-10">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
              <label className="block text-white/80 font-body text-sm mb-2">Rechercher</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Titre, description…"
                className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-4">
              <label className="block text-white/80 font-body text-sm mb-2">Stack</label>
              <select
                value={stackFilter}
                onChange={(e) => setStackFilter(e.target.value)}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-white outline-none focus:border-white/30"
              >
                <option value="">Toutes</option>
                {allStacks.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((project) => (
              <article
                key={project.slug}
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur overflow-hidden"
              >
                <div className="relative aspect-[16/10] bg-black/30">
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="h-full w-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = "none"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="font-display text-white text-3xl leading-tight tracking-tight">{project.title}</h2>
                    <p className="mt-2 text-white/70 font-body line-clamp-2">{project.shortDescription}</p>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.stacks.map((s) => (
                      <span
                        key={s.name}
                        className="text-xs text-white/80 border border-white/15 bg-white/5 rounded-full px-3 py-1"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/project/${project.slug}`}
                      className="inline-flex items-center justify-center rounded-full px-4 py-2 border border-white/15 bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                      Voir le projet
                    </Link>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-full px-4 py-2 border border-white/15 bg-transparent hover:bg-white/5 text-white/90 transition-colors"
                      >
                        GitHub
                      </a>
                    )}

                    <div className="ml-auto text-white/40 text-sm font-body">#{project.slug}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-white/70">
              Aucun projet ne correspond à ta recherche.
            </div>
          )}
        </div>
      </main>
    </>
  )
}
