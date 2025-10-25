import TrackList from "../TrackList/TrackList";
import "./Playlist.css"

export default function Playlist({ name, tracks, onRemove, onNameChange }) {
    return (
        <section>
            <input
                className="playlist-title panel-title"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                /* Add the Enter key submit */
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault(); // Don't submit
                        e.currentTarget.blur(); // Leave the field = commit
                    }
                }}
                aria-label="Playlist name"
                placeholder="Playlist name"
            />
            <TrackList tracks={tracks} onRemove={onRemove} />
            <button>Save to Spotify</button>
        </section>
    );
}