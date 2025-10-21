export default function Track({ track }) {
    return (
        <div>
            {/* Display the track info */}
            <h4>{track.name}</h4>
            <p>{track.artist} &ndash; {track.album}</p>
        </div>
    );
}