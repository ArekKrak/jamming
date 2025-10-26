import "./SearchBar.css"

export default function SearchBar({ onSearch }) {
    return (
        <section>
            <input className="input-field" placeholder="Enter a song, artist, or album" />
            <button>Search</button>
        </section>
    );
}