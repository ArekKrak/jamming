# Jammming - Testing and Debugging Log

## Scope
Components: App, SearchBar, SearchResults/Track, Playlist
Services: spotifyAuth, search, playlist

## Environment 
- Date: 27 Oct 2025
- Browser Chrome 141 (DevTools)
- OS: Linux (Debian)
- Build: dev (Vite)

### Search
- [x] Empty term does not call API
- [x] "Rammstein" triggers exactly one request
  - [x] Shows loading/disabled state

**Notes:** DevTools shows a CORS preflight (OPTIONS 200) + fetch (304 due to cache). Count only the fetch as "one request".

### Add / Remove / Dedup
- [x] "+" adds track once
- [x] Second "+" does not duplicate
- [x] "-" removes the track by id

### Save Flow
- [x] Blocks save with empty name
- [x] Blocks save with 0 tracks
- [x] Successful save resets UI and shows URL

### Auth & Errors
- [x] Expired token path renews and succeeds
- [x] 401/403 show friendly alert
- [x] 429 (rate limit suggests retry)