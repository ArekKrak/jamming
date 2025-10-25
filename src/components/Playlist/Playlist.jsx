import TrackList from "../TrackList/TrackList";

export default function Playlist({ name, tracks, onRemove }) {
    return (
        <section>
            <h3>{name}</h3>
            <TrackList tracks={tracks} onRemove={onRemove} />
            <button>Save to Spotify</button>
        </section>
    );
}