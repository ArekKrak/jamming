import "./SearchBar.css"
import { useState } from "react"; // enable users to enter a search parameter (we must capture their input first)

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState(""); // enter a search parameter, makes the input a controlled component - UI shows
                                            // `query`. and `query` updates as the user types
    return (
        <section>
            <input className="input-field" placeholder="Enter a song, artist, or album" />
            <button>Search</button>
        </section>
    );
}