# Design Document - Exclude Playlist Items from Search Results

*Date:* 28 Oct 2025 

---

## OBJECTIVE

Only display songs in search results that are **not already present** in the current playlist. When a user **adds** a track, it disappears from results; when they **remove** a track from the playlist, it **reappears** in the current results view.

---

## BACKGROUND

Showing duplicate tracks in search while they're already in the playlist creates noise and leads to accidental re-adds. Filtering them out streamlines the workflow:
- Users can trust that "+" won't produce duplicates.
- The UI reflects changes instantly, reducing confusion.
- This change does **not** affect authentication or the save flow.

---

## TECHNICAL DESIGN

### Data & State (existing)

- `playlistTracks: Track[]` (in `App`)
- `searchResults: Track[]` (in `App`)
- `searchTracks(query)` returns mapped `Track` objects with `{ id, name, artist, album, uri }`.

### Implementation

1. **Filter on search** (avoid showing tracks already in playlist):
    - After `searchTracks(query)` resolves in `App.handleSearch`, build a `Set` of playlist IDs and filter the results.
    ```
    const results = await searchTracks(query);
    const inPlaylist = new Set(playlistTracks.map(t => t.id));
    searchResults(results.filter(t => !inPlaylist.has(t.id)));
    ```
2. **On add ("+")** remove the added track from current results immediately:
    ```
    setPlaylistTracks(prevTracks => prevTracks.some(savedTracks => 
        savedTracks.id === track.id) ? prevTracks : [...prevTracks, track]
    );
    setSearchResults(prev => prev.filter(t => t.id !== track.id));
    ```
3. **On remove ("-")** reinsert the removed track back into current results immediately: 
    ```
    setPlaylistTracks((prevTracks) => prevTracks.filter((savedTrack) => savedTrack.id => !== track.id));
    setSearchResults(prev => prev.some(t => t.id === t.id) ? prev : [track, ...prev]);
    ```
    - reinserts at the top for instant feedback (see Caveats for ordering note)

### Edge Cases & Notes

- **Identity:** Dedup by `track.id` (Spotify track IDs). If the same song appears as a different release (different ID), it is treated as a distinct track (intentional).
- **Reinsert semantics:** Reinsert happens regardless of the current query string. If the user removes a track that wouldn't match the current query, it still reappears.
- **Multiple adds/removes:** Logic guards against duplicates in `playlistTracks` and `searchResults`.
- **No service change:** `search.js` unchanged except for earlier guard; no API shape changes.

### Accessibility & UX

- No UI control changes; this is behavior/state-only.
- The search and playlist lists update without layout jumps.

---

## CAVEATS

- **Result ordering on reinsert:** Reinsert places the track at the **top**, not the original position.
- **Query-consistency:** Reinsert does not verify that the removed track matches the current search term.