import "./SearchBar.css"
import { useState } from "react"; // enable users to enter a search parameter (we must capture their input first)

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState(""); // a state variable to enter a search parameter, makes the input a 
                                            // controlled component - UI shows `query` and `query` updates as the user types
    
    // Make your request to the API - a trigger that calls the App's `handleSearch` which uses `fetch` via `spotifyFetch`
    async function handleSubmit(event) {
        if (event) event.preventDefault(); // don't reload the page
        if (!onSearch) return;          // guard if paren didn't pass a handler

        const trimmed = String(query).trim(); // avoid spaces-only
        if (trimmed === "") return;         // skip empty searches

        await onSearch(trimmed);            // parent (App) will call the API
    }
    
    return (
        <section>
            <input 
                className="input-field" 
                placeholder="Enter a song, artist, or album"
                value={query}                               // Connect the search bar to Spotify
                onChange={(e) => setQuery(e.target.value)}  // Whatever the user types is captured in `query` - that's what
                aria-label="Search query"                   // we'll send to Spotify
            />
            <button>Search</button>
        </section>
    );
}