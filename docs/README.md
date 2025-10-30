# Jammming — Spotify Playlist Builder (React + Vite)

![HTML5](https://img.shields.io/badge/HTML5-Markup-fff?logo=html5&logoColor=E34F26&style=flat)
![CSS3](https://img.shields.io/badge/CSS3-Styling-fff?logo=css3&logoColor=1572B6&style=flat)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2023-F7DF1E?logo=javascript&logoColor=black&style=flat)
![React](https://img.shields.io/badge/React-18%20%2B%20Hooks-61DAFB?logo=react&logoColor=black&style=flat)
![Vite](https://img.shields.io/badge/Vite-Dev%20Server-646CFF?logo=vite&logoColor=white&style=flat)
![Spotify%20API](https://img.shields.io/badge/Spotify-Web%20API-1DB954?logo=spotify&logoColor=white&style=flat)
![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?logo=eslint&logoColor=white&style=flat)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?logo=github&logoColor=white&style=flat)](https://github.com/ArekKrak/jammming)

This app was built as part of the Codecademy *Full-Stack Web Development* path (**Jammming** project, Parts 1-2).  

**Course Brief (summary):**  
Build a React app that authenticates with Spotify (PKCE), lets users search tracks, compose a playlist, and save it to their account via the Spotify Web API.

## Overview

Jammming is a small but production-shaped React app: **search** for tracks, **add/remove** with dedup, and **save** to Spotify as a new playlist. It uses **PKCE auth**, defensive fetch wrappers, and a tiny manual testing log to keep behavior predictable.

   **Status:** Part 1 complete; Part 2 feature implemented (exclude already-added tracks from results).

---

## Features

- **Search tracks** via Spotify's Web API (guarded: no empty requests).
- **Add / Remove / Dedup** — "+" adds once; "-" removes by id.
- **Save to Spotify** — creates a playlist and adds tracks.
- **Loading states** — "Searching..." and "Saving..." disable controls while in flight.
- **Error handling** — friendly alerts on network/offline; token renew flow verified.
- **Part 2 Feature: Search results hide tracks already in the playlist**, and removed tracks **reappear** immediately in the results.

---

## Tech Stack

- **React (Vite)** — fast dev server + HMR.
- **JavaScript (ES202x)** — functional React with hooks.
- **Spotify Web API** — search, create playlist, add tracks.
- **PKCE OAuth** — secure client-side auth (no secret).
- **ESLint** — basic linting.

---

## Screens / Flow

- **Connect Spotify** — login/consent with PKCE.
- **Search** — results list with "+".
- **Playlist** — chosen songs with "-" and editable name.
- **Save to Spotify** — success alert with playlist URL; UI resets.

---

## Project Structure

```
arek-portfolio-website/
├── index.html                  # Home
├── about.html                  # Aboute
├── projects.html               # Projects
├── contact.html                # Contact
├── styles.css                  # Global styles
├── main.js                     # Interactivity (portrait, theme, background)
├── cypher-demo.html            # Demo page
├── mixed-messages-demo.html    # Demo page
├── styles-demo.css             # Demo styles
├── manifest.json               # Manifest
├── img/                        # Images and SVGs
│   ├── about-me.svg
│   ├── about-profile-pic.jpg
│   ├── back-arrow.svg
│   ├── background-dark.svg
│   └── ...etc
├── vid/                        # Project demo videos
│   ├── cypher.mp4
│   └── mixed-messages.mp4
└── README.md                   # Project documentation
```

---

## Live Site
**[View the Live Project](https://arekkrak.github.io/arek-portfolio-website/)**

---

## Key Concepts Demonstrated

- Responsive design with `@media` queries
- Flexbox & CSS Grid for layout.
- SVG with gradient fills synchronized with text gradients.
- Accessibility patterns (reduced motion, semantics).
- Local development workflow + Git/GitHub.
- Static hosting via GitHub Pages (custom domain ready).

---

## Future Improvements

This project serves as a front-end milestone and will be further expanded by:

 - Add more projects & remove older ones as I progress.
 - Improve image assets (replace medieval portrait with a professional one).
 - Expand JavaScript interactivity (project filters, animations with motion-safe fallbacks).
 - Add Lighthouse CI badge + automated checks.
 - Polish mobile nav micro-interactions.

---

## Acknowledgements

- Icons: [SVG Repo](https://www.svgrepo.com/)
- Backgrounds: [SVG backgrounds](https://www.svgbackgrounds.com/)
- Fonts: [Google Fonts](https://fonts.google.com/specimen/Lato)

---

## Contact
If you're a recruiter, mentor, or fellow developer interested in collaboration or feedback:

**Arek Krakowiak**  
[369arek12@protonmail.com](mailto:369arek12@protonmail.com)

---

Thank you for viewing this project!