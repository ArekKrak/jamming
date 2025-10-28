import { spotifyFetch } from "./spotifyAuth";

export async function searchTracks(query) {
    // Guard: empty/whitespace query - nothing to search
    if (query === null || query === undefined) {
        return [];
    }
    query = String(query);
    const trimmed = query.trim();
    if (trimmed === "") {
        return [];
    }
    // 2) Build the URL: /v1/search?q=...&type=track&limit=10
    const params = new URLSearchParams();
    params.set("q", trimmed);
    params.set("type", "track");
    params.set("limit", "10");

    // 3) Call Spotify (this ensures a valid token or redirects if needed)
    const response = await spotifyFetch("/v1/search?" + params.toString());

    // 4) Read JSON safely
    const data = await response.json();

    // 5) Extract tracks array (handle missing fields defensively)
    const tracksObj = (data && data.tracks) ? data.tracks : null;
    const items = tracksObj && Array.isArray(tracksObj.items) ? tracksObj.items : [];

    // 6) Map to a simple, consistent shape for the UI
    const results = items.map(function (t) {
        const artists = Array.isArray(t.artists) ? t.artists : [];
        const artistNames = artists.map(function (a) {
            return a && a.name ? a.name : "";
        }).filter(Boolean);

        const albumName = t && t.album && t.album.name ? t.album.name : "";

        return {
            id: t && t.id ? t.id : "",
            name: t && t.name ? t.name : "",
            artist: artistNames.join(", "),
            album: albumName,
            uri: t && t.uri ? t.uri : "",
        };
    });

    return results;
}