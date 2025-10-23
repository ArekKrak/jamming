import "./Track.css"

export default function Track({ track, onAdd }) {
    return (
        <div className="track">
            <div className="track-info">
                {/* Display the track info */}
                <h4>{track.name}</h4>
                <p>{track.artist} &ndash; {track.album}</p>
            </div>
            {onAdd && (<button onClick={() => onAdd(track)}>+</button>)}
        </div>
    );
}