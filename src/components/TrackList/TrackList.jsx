import Track from "../Track/Track"

export default function TrackList({ tracks, onAdd }) {
    return (
        <section>
            {/* Iterate over arrays using JS's .map() */}
            {tracks.map((track) => (
                <Track key={track.id} track={track} onAdd={onAdd} />
            ))}
        </section>
    );
}