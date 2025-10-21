import SearchBar from "../SearchBar/SearchBar"
import SearchResults from "../SearchResults/SearchResults"
import Playlist from "../Playlist/Playlist"

export default function App() {
  return (
    <div>
      <h1>Jammming</h1>
      <SearchBar />
      <div>
        <SearchResults />
        <Playlist />
      </div>
    </div>
  );
}