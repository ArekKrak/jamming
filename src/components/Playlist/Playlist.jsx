import TrackList from "../TrackList/TrackList";
import "./Playlist.css"

export default function Playlist({ name, tracks, onRemove, onNameChange, onSave }) {
    return (
        <section>
            <input
                className="playlist-title panel-title"
                value={name}
                /* The onChange attribute to update the list */
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
            {/* Pass the onSave prop and add a guard that disables the button when the playlist has no tracks */}
            <button className="playlist-button" onClick={onSave} disabled={tracks.length === 0}>Save to Spotify</button>
        </section>
    );
}