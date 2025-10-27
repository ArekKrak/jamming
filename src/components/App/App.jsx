/* Import useState for later use */
import { getAccessToken, spotifyFetch } from "../../services/spotifyAuth";
import { useState, useEffect } from "react";
import { searchTracks } from "../../services/search";
import { savePlaylistToSpotify } from "../../services/playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import "./App.css";

export default function App() {
  /* A state variable that uses state to store information */
  const [searchResults, setSearchResults] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  /* Use state to store playlist name */
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [isSaving, setIsSaving] = useState(false); // NEW

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

  /* "save their custom playlist from Jammming into their account ... when they click the button" */
  async function savePlaylist() {
    const uris = playlistTracks.map(t => t.uri).filter(Boolean);
    const name = String(playlistName).trim();
    if (!name) {
      alert("Please, name your playlist first.");
      return;
    }
    if (uris.length === 0) {
      alert("No tracks to save!");
      return;
    }
    try {
      setIsSaving(true); // NEW start
      const { playlistId, url } = await savePlaylistToSpotify(name, uris, "Created with Jammming");
      // Clear UI after success
      setPlaylistTracks([]);
      setPlaylistName("New Playlist");
      // Optional: open the playlist in a new tab, or just alert the URL
      //window.open(url, "_blank");
      alert("Playlist saved! " + (url || `id: ${playlistId}`));
    } catch (e) {
      console.error(e);
      alert("Failed to save playlist: " + e.message);
    } finally {
      setIsSaving(false); // NEW end
    }
  }

  useEffect(() => {
    /* Vite dev-only guard */
    if (import.meta.env.DEV) {
      window.debugSave = () => savePlaylist();
      return () => { delete window.debugSave; };
    }
  }, []);

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
            isSaving={isSaving} // NEW
          />
        </section>
      </div>
    </div>
  );
}