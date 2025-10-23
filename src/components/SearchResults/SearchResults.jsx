import TrackList from "../TrackList/TrackList";

export default function SearchResults({ tracks, onAdd }) {
    return (
        <section>
            <h3>Search Results</h3>
            {/* Render the TrackList component that displays the actual tracks */}
            <TrackList tracks={tracks} onAdd={onAdd} />
        </section>
    );
}