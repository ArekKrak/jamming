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
- **Add / Remove / Dedup** — `+` adds once; `-` removes by id.
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
jammming/
├── docs/                                    # Design docs and ADRs
│   ├── DESIGN_EXCLUDE_PLAYLIST_ITEMS.md        # Part 2 feature design
│   ├── README.md                               # Project documentation
│   └── TESTING.md                              # Manual testing & debugging log
├── public/                                  # Static assets served as-is
│   └── vite.svg                                # Favicon
├── src/                                     # Application source
│   ├── assets/                                 # Static assets
│   ├── components/                             # UI components
│   │   ├── App/{.jsx, .css}                       # App state wiring
│   │   ├── SearchBar/{.jsx, .css}                 # Controlled input; "Searching..."
│   │   ├── SearchResults/{.jsx, .css}             # Results with "+"
│   │   ├── TrackList/{.jsx, .css}                 # Maps tracks → <Track/>
│   │   ├── Track/{.jsx, .css}                     # Row with + / -
│   │   └── Playlist/{.jsx, .css}                  # Name, list, "Saving..."
│   ├── services/                               # API/auth logic
│   │   ├── playlist.js                            # savePlaylistToSpotify(...)
│   │   ├── search.js                              # searchTracks(query)
│   │   └── spotifyAuth.js                         # PKCE + spotifyFetch wrapper
│   ├── index.css                               # Global app styles
│   └── main.jsx                                # React root render
├── .gitignore                               # Ignore node_modules, .env, build output
├── index.html                               # Vite entry HTML (mount point for React)
├── package-lock.json                        # NPM lockfile (commit this)
├── package.json                             # Project metadata, scripts, dependencies
└── vite.config.js                           # Vite config
```

---

## Live Site

**[View the Live Project](https://jammming-wapp.netlify.app/)**

---

## Testing & Debugging

- Manual checklist in **`TESTING.md`** (Search, Add/Remove/Dedup, Save Flow, Auth & Errors).
- **Chrome DevTools** (Network/Offline, Slow 3G) & **React DevTools** for state inspection.

See detailed notes in [TESTING.md](./TESTING.md).

---

## Design Docs

- Part 2: **Exclude Playlist Items from Search Results** — reasoning, tiny diffs, caveats.

---

## Limitations

 - Some API responses are cached (DevTools may show `304` revalidation).
 - Spotify rate limits (429) are rare on dev clients; UI surfaces a friendly error if they occur.
 - Different releases of ”the same song” have different IDs and are treated as distinct — by design.

---

## Future Improvements

- Deploy to Netlify (update **Live URL** and add a screenshot).
- Private playlist support (`playlist-modify-private`) + toggle.
- Debounced search-on-typing with minimal requests.
- Toast notifications instead of alerts.
- Persist in-progress playlist to `sessionStorage`.

---

## Contact
If you're a recruiter, mentor, or fellow developer interested in collaboration or feedback:

**Arek Krakowiak**  
[369arek12@protonmail.com](mailto:369arek12@protonmail.com)

---

Thank you for viewing this project!