import TrackList from "../TrackList/TrackList";

export default function Playlist({ name, tracks }) {
    return (
        <section>
            <h3>{name}</h3>
            <TrackList tracks={tracks} />
            <button>Save to Spotify</button>
        </section>
    );
}