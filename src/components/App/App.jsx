/* Import useState for later use */
import { getAccessToken, spotifyFetch } from "../../services/spotifyAuth";
import { useState, useEffect } from "react";
import { searchTracks } from "../../services/search";
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
  const [playlistName, setPlaylistName] = useState("New Playlist");

  function addTrack(track) {
    /* Check if the track is already in the playlist and add a new one to the playlist */
    setPlaylistTracks(prevTracks => prevTracks.some(savedTrack => 
      savedTrack.id === track.id) ? prevTracks : [...prevTracks, track]
    );
  }

  function removeTrack(track) {
    /* Take the current playlist (prevTracks) and return a new array that excludes
    the track whose ID matches the one clicked "-" */
    setPlaylistTracks((prevTracks) => prevTracks.filter((savedTrack) => savedTrack.id !== track.id));
  }

  function savePlaylist() {
    const uris = playlistTracks.map(t => t.uri).filter(Boolean);
    if (uris.length === 0) {
      console.log("No data to save!");
      return;
    }
    console.log("Saving playlist: ", playlistName, uris);
    setPlaylistTracks([]);
  }

  useEffect(() => {
    /* Vite dev-only guard */
    if (import.meta.env.DEV) {
      window.debugSave = () => savePlaylist();
      return () => { delete window.debugSave; };
    }
  }, [savePlaylist]);

  async function onConnect() {
    const t = await getAccessToken(); // redirects to Spotify if not logged in
    if (!t) return;   // navigation happening

    const res = await spotifyFetch("/v1/me");
    const me = await res.json();
    alert(`Connected as: ${me.display_name}`);
  }

  async function handleSearch(query) {
    try {
      const results = await searchTracks(query);
      setSearchResults(results);
    } catch (e) {
      console.error("Search failed:", e);
      alert("Search error: " + e.message);
    }
  }

  return (
    <div>
      <h1>Jammming</h1>
      <button onClick={onConnect}>Connect Spotify</button>
      <SearchBar onSearch={handleSearch} />
      <div className="container">
        <section className="section">
          {/* Pass the searchResults down to the child component (SearchResults)
          as a prop */}
          <SearchResults tracks={searchResults} onAdd={addTrack} />
        </section>
        <section className="section">
          <Playlist 
            name={playlistName} 
            tracks={playlistTracks} 
            onRemove={removeTrack} 
            onNameChange={setPlaylistName}
            onSave={savePlaylist}
          />
        </section>
      </div>
    </div>
  );
}