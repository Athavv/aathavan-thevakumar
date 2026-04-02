# Portfolio Redesign — Design Spec
**Date:** 2026-04-02  
**Approche choisie:** C — Hybrid Editorial  
**Stack:** React + TypeScript + Vite + Tailwind v4 + GSAP (ScrollTrigger, gsap.registerPlugin)

---

## 1. Fondations visuelles

### Palette de couleurs
| Token | Valeur | Usage |
|---|---|---|
| `--bg` | `#07080f` | Background global |
| `--surface-1` | `#0f1020` | Cards, nav |
| `--surface-2` | `#141528` | Hover states |
| `--accent-violet` | `#7B5CF0` | Accent primaire |
| `--accent-amber` | `#F5A623` | Accent secondaire |
| `--fg` | `#FFFFFF` | Texte principal |
| `--fg-muted` | `#6B7280` | Texte secondaire |
| `--border` | `rgba(255,255,255,0.08)` | Bordures subtiles |

### Typographie
- **Display** : Clash Display (Bold/ExtraBold) — ALL CAPS — titres hero, section titles, oversized text
- **Body** : Inter (Regular/Medium) — tout le texte courant, descriptions
- **Mono** : JetBrains Mono — labels techniques, stack names, dates, numérotation

Import via CDN (fontsource ou @import dans index.css).

### Layout
- Max-width : `1200px`
- Padding horizontal : `clamp(24px, 6vw, 80px)`
- Smooth scroll : GSAP natif
- Grain texture overlay : `noise.svg` ou CSS pseudo-element, opacity `0.03`, pointer-events none, fixed, z-index top

### GSAP Setup
```ts
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```
`registerPlugin` appelé **une seule fois** dans `main.tsx` avant le render React.  
Tous les contextes GSAP sont créés avec `gsap.context()` et revertés au cleanup `useLayoutEffect`.

---

## 2. Composants globaux

### Header / Nav
- Position : `fixed`, top 0, full width, z-index élevé
- État initial : fond transparent
- Au scroll (>50px) : `background: rgba(7,8,15,0.85)`, `backdrop-filter: blur(12px)`, transition 300ms
- Logo : initiales `AT` en Clash Display Bold, couleur blanche
- Liens : `HOME`, `PROJETS`, `À PROPOS`, `EXPÉRIENCE`, `CONTACT` — Inter Medium, uppercase, letter-spacing 0.1em
- CTA : bouton pill `CV` en amber, ouvre le PDF dans un nouvel onglet
- Mobile : hamburger animé GSAP (3 lignes → X), menu overlay fullscreen avec links en grand

### Footer
- Minimal : `AATHAVAN THEVAKUMAR © 2026` à gauche, `Fait avec GSAP` à droite
- Border-top 1px `--border`

### Grain texture
- Composant `<Grain />` : div fixed, full viewport, z-index 9999, pointer-events none
- Implémentation : SVG inline avec `<feTurbulence>` + `<feColorMatrix>` en `filter`, rendu en pseudo-element CSS `::after` sur le body
- Opacity : 0.03 — assez subtil pour ne pas gêner la lisibilité
- Aucune dépendance externe, aucun fichier asset nécessaire

---

## 3. Section Hero

### Layout
Deux colonnes (desktop), colonne unique (mobile) :
- **Col gauche (60%)** : texte
- **Col droite (40%)** : photo + floating cards

### Contenu gauche
- Texte intro : `DÉVELOPPEUR FULL STACK` en JetBrains Mono, amber, letter-spacing 0.2em, uppercase — avant le nom
- Nom oversized : `AATHAVAN` / `THEVAKUMAR` — Clash Display ExtraBold, `clamp(4rem, 8vw, 8rem)`, blanc, leading 0.9
- Fond : même nom dupliqué en opacity 0.04, décalé légèrement, crée une couche de profondeur
- Description courte : Inter Regular, `--fg-muted`, 1 ligne
- CTA buttons : `Voir mes projets` (pill violet) + `Me contacter` (pill outline blanc)
- Scroll indicator : ligne verticale animée + texte `SCROLL` en mono

### Contenu droit
- Photo `aathavan_thevakumar.jpg` : clip-path polygonal (forme graphique asymétrique), halo violet en box-shadow/filter
- 3 floating cards glassmorphism :
  - `@ Xelians` + titre Alternance
  - `BUT MMI 2026`
  - `6 projets`
  - Style : `background: rgba(255,255,255,0.05)`, `border: 1px solid rgba(255,255,255,0.1)`, `backdrop-filter: blur(10px)`, border-radius 12px, padding 12px 16px

### Animation GSAP (entrée)
Timeline séquentielle, durée totale ~1.6s :
1. `t=0` — curtain div (violet, full-screen) slide de droite vers `x: -100%`, ease `power3.inOut`, duration 0.8
2. `t=0.4` — tagline mono fade+slide up, duration 0.5
3. `t=0.5` — lettres du nom : `yPercent: 110 → 0`, stagger 0.03, ease `expo.out`, duration 1.0
4. `t=0.7` — description + CTAs fade+slide up, stagger 0.1
5. `t=0.8` — photo scale `0.85 → 1` + fade, duration 0.7
6. `t=0.9` — floating cards entrent en stagger depuis différentes directions, duration 0.5 chacune
7. `t=1.2` — scroll indicator fade in

---

## 4. Section Projects

### Layout
- Hauteur : `300vh` (scroll pinning)
- Sticky container : `height: 100vh`
- Titre `PROJETS` : Clash Display ExtraBold, oversized, pin pendant tout le scroll de section
- Carousel arc : reprend la logique existante (translateX + rotation + yOffset) mais remplacé par **GSAP ScrollTrigger**

### Cards projet
- Taille : `min(45vw, 480px)` desktop, `85vw` mobile
- Border-radius : 20px
- Image full-card avec `object-fit: cover`
- Overlay gradient en bas : `linear-gradient(transparent, rgba(7,8,15,0.9))`
- En bas de card : titre en Clash Display Bold + shortDescription en Inter small
- En haut à droite : stack logos (petits, 24px)
- Border : `1px solid rgba(255,255,255,0.08)`

### Hover card
- GSAP `mouseenter` : `scale: 1.03`, `rotateX: -5deg`, `rotateY: 5deg` (tilt 3D) — duration 0.3
- Overlay apparaît : flèche diagonale en haut à droite

### Animation ScrollTrigger
- ScrollTrigger scrub sur la track translateX
- La numérotation `01 / 06` en mono se met à jour au scroll
- Le fond radial violet pulse via `gsap.to` en loop

---

## 5. Section About

### Layout
Asymétrique, deux colonnes :
- **Gauche (45%)** : photo avec même clip-path que hero + un cadre décoratif (border violet, offset)
- **Droite (55%)** : texte + timeline + CTA

### Contenu
- Titre `À PROPOS` : Clash Display, reveal au ScrollTrigger (slide depuis gauche)
- Texte biographique : Inter, ~4 lignes
- Timeline éducation :
  - Ligne verticale qui se "dessine" via `scaleY: 0 → 1` au ScrollTrigger
  - Chaque item entre en stagger depuis la droite (slide + fade)
  - Dot : cercle violet pour current, gris pour passé
- Bouton `Voir mon CV` : pill amber

---

## 6. Section Skills

### Layout
- Titre `COMPÉTENCES` oversized en fond (opacity 0.03), Clash Display
- Titre visible plus petit au-dessus
- Deux groupes : `FRONTEND` / `OUTILS & AUTRES` — labels en mono amber
- Grille de logos : 6-8 colonnes desktop, 4 mobile
- Chaque logo : 48px, grayscale par défaut, couleur au hover

### Logos inclus
Frontend : Angular, HTML, CSS, JavaScript, Tailwind, Bootstrap, ChartJS  
Outils : PHP, MySQL, Figma, WordPress, GitHub

### Stats
3 grandes métriques en bas :
- `3 ANS` d'études
- `6 PROJETS` réalisés  
- `2 STAGES` chez Xelians

### Animation GSAP
- Logos : wave stagger animation au ScrollTrigger (`y: 30 → 0`, opacity, stagger 0.05)
- Stats : `countUp` GSAP natif (`0 → N`) au ScrollTrigger, une fois

---

## 7. Section Experience

### Layout
- Titre `EXPÉRIENCES` : Clash Display, reveal au scroll
- Cards empilées verticalement, max-width 800px, centrées
- Chaque card : surface-1 background, border, border-radius 16px, padding 32px

### Contenu card
- Numéro `01` en Clash Display, opacity 0.05, très grand, en fond de card
- Logo company (48px)
- Company name : Clash Display Medium
- Période : JetBrains Mono, muted
- Positions : liste avec marker violet, titre + période + description

### Animation
- Cards entrent au ScrollTrigger : `y: 60 → 0`, opacity, stagger 0.15, ease `power2.out`

---

## 8. Section Contact

### Layout
- Full-width, padding vertical `120px`
- Centré
- Fond : dégradé radial amber très subtil centré

### Contenu
- Titre oversized `TRAVAILLONS` / `ENSEMBLE` : Clash Display ExtraBold, `clamp(4rem, 10vw, 10rem)`, centré
- Email cliquable : Clash Display Medium, `clamp(1.2rem, 3vw, 2rem)`, blanc, underline au hover
- Deux liens sociaux pill : LinkedIn + GitHub
- Effet magnétique sur le bouton email : GSAP `mousemove` qui translate légèrement le bouton vers le curseur

### Animation
- Titre révélé ligne par ligne au ScrollTrigger
- Email fade in avec délai
- Social links entrent en stagger

---

## 9. Structure de fichiers

```
src/
├── components/
│   ├── layouts/
│   │   ├── Header.tsx          # Refonte complète
│   │   └── Footer.tsx          # Nouveau
│   ├── sections/
│   │   ├── Hero.tsx            # Refonte complète
│   │   ├── Projects.tsx        # Refonte (ScrollTrigger)
│   │   ├── AboutMe.tsx         # Refonte complète
│   │   ├── Skills.tsx          # Nouveau
│   │   ├── Experience.tsx      # Refonte complète
│   │   └── Contact.tsx         # Refonte complète
│   └── ui/
│       ├── Grain.tsx           # Nouveau — texture overlay
│       └── FloatingCard.tsx    # Nouveau — glassmorphism card
├── hooks/
│   └── useGsapReveal.ts        # Hook utilitaire ScrollTrigger reveal
├── style/
│   └── index.css               # Tokens CSS + imports typo
└── pages/
    ├── Home.tsx
    └── ProjectDetail.tsx       # Légère mise à jour style
```

---

## 10. Dépendances à ajouter

```bash
# JetBrains Mono via fontsource
npm install @fontsource/jetbrains-mono

# GSAP ScrollTrigger est déjà inclus dans gsap 3.x
# (déjà installé : gsap ^3.13.0)

# Clash Display : PAS sur fontsource — import CDN Fontshare dans index.css :
# @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
```

---

## 11. Points d'attention

- **Performance** : Tous les `gsap.context()` revertés dans les cleanup useEffect/useLayoutEffect
- **ScrollTrigger.refresh()** appelé après les resize pour recalculer les positions
- **Mobile** : animations simplifiées (pas de tilt 3D, floating cards cachées, stagger plus courts)
- **Accessibilité** : `prefers-reduced-motion` — wrapper les animations dans une condition
- **Images** : le `clip-path` sur la photo utilise des coordonnées fixes, ajustées selon l'image
