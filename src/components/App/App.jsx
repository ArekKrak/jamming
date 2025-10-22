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
    album: "Cherry"
  },
  {
    id: 2,
    name: "True Believer",
    artist: "Biffy Clyro",
    album: "True Believer"
  },
  {
    id: 3,
    name: "Now We Are Free",
    artist: "Hans Zimmer",
    album: "Gladiator"
  }
];

/* Mock playlit tracks */
const mockPlaylistTracks = [
  {
    id: 4,
    name: "Unforgiven",
    artist: "Metallica",
    album: "Metallica"
  },
  {
    id: 5,
    name: "Haifisch",
    artist: "Rammstein",
    album: "Liebe ist für alle da"
  }
];

export default function App() {
  /* A state variable that uses state to store information */
  const [searchResults, setSearchResults] = useState(mockTracks);
  const [playlistTracks, setPlaylistTracks] = useState(mockPlaylistTracks);
  /* Use state to store playlist name */
  const [playlistName, setPlaylistName] = useState("Fave Charts");

  return (
    <div>
      <h1>Jammming</h1>
      <SearchBar />
      <div clsassName="container">
        <section clsassName="section">
          {/* Pass the searchResults down to the child component (SearchResults)
          as a prop */}
          <SearchResults tracks={searchResults} />
        </section>
        <section clsassName="section">
          <Playlist name={playlistName} tracks={playlistTracks} />
        </section>
      </div>
    </div>
  );
}