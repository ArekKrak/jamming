/* Import useState for later use */
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import "./App.css";

/* Hard-code array of track objects */
const mockTracks = [
  {
    id: 1,
    name: "Cherry",
    artist: "King Princess",
    album: "Cherry",
    uri: 'spotify:track:111'
  },
  {
    id: 2,
    name: "True Believer",
    artist: "Biffy Clyro",
    album: "True Believer",
    uri: 'spotify:track:222'
  },
  {
    id: 3,
    name: "Now We Are Free",
    artist: "Hans Zimmer",
    album: "Gladiator",
    uri: 'spotify:track:333'
  }
];

/* Mock playlit tracks */
const mockPlaylistTracks = [
  {
    id: 4,
    name: "Unforgiven",
    artist: "Metallica",
    album: "Metallica",
    uri: 'spotify:track:444'
  },
  {
    id: 5,
    name: "Haifisch",
    artist: "Rammstein",
    album: "Liebe ist für alle da",
    uri: 'spotify:track:555'
  }
];

export default function App() {
  /* A state variable that uses state to store information */
  const [searchResults, setSearchResults] = useState(mockTracks);
  const [playlistTracks, setPlaylistTracks] = useState(mockPlaylistTracks);
  /* Use state to store playlist name */
  const [playlistName, setPlaylistName] = useState("");

  function addTrack(track) {
    /* Check if the track is already in the playlist */
    if (playlistTracks.some((savedTrack) => savedTrack.id === track.id)) {
      return;
    }

    /* Add new track to the playlist */
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
  }

  function removeTrack(track) {
    /* Take the current playlist (prevTracks) and return a new array that excludes
    the track whose ID matches the one clicked "-" */
    setPlaylistTracks((prevTracks) => prevTracks.filter((savedTrack) => savedTrack.id !== track.id));
  }

  return (
    <div>
      <h1>Jammming</h1>
      <SearchBar />
      <div className="container">
        <section className="section">
          {/* Pass the searchResults down to the child component (SearchResults)
          as a prop */}
          <SearchResults tracks={searchResults} onAdd={addTrack} />
        </section>
        <section className="section">
          <Playlist name={playlistName} tracks={playlistTracks} onRemove={removeTrack} onNameChange={setPlaylistName} />
        </section>
      </div>
    </div>
  );
}