export default function Playlist({ name, tracks }) {
    return (
        <section>
            <h3>{name}</h3>
            {/* render tracks here */}
            <button>Save to Spotify</button>
        </section>
    );
}