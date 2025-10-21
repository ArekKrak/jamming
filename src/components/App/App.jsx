/* Import useState for later use */
import { useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

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

export default function App() {
  /* A state variable that uses state to store information */
  const [searchResults, setSearchResults] = useState(mockTracks);

  return (
    <div>
      <h1>Jammming</h1>
      <SearchBar />
      <div>
        {/* Pass the searchResults down to the child component (SearchResults)
        as a prop */}
        <SearchResults tracks={searchResults} />
        <Playlist />
      </div>
    </div>
  );
}