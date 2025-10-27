/* THIS IS A SERVICE THAT TALKS TO SPOTIFY AND MAKES REQUESTS TO CREATE NEW PLAYLISTS */

import { spotifyFetch } from "./spotifyAuth"; // Make requests to create new playlists.

/* Get the current user's Spotify ID ("you'll need the user's ID...") */
export async function getCurrentUserId() {
    const res = await spotifyFetch("/v1/me") // GET current user
    const me = await res.json();
    if (!me || !me.id) throw new Error("Could not read user id from /v1/me");
    return me.id;       // e.g. "arekk..."
}

/* Create a playlist shell with your chosen name ("POST to /v1/users/{user_id}/playlists") */
export async function createPlaylist(userId, name, description = "") {
    const body = { name, description, public: true }; // IMPORTANT: public must match current scope in .env
    // Method: POST
    const url = `/v1/users/${encodeURIComponent(userId)}/playlists`; //  `encodeURIComponent` ensures that if the `userId` has special characters, the URL stays valid
    // "use fetch() to make your requests." Make the POST request using my authenticated fetch:
    const res = await spotifyFetch(url, {
        method: "POST",
        body: JSON.stringify(body) // spotifyFetch sets Content-Type: application/json
    });
    // Read the responses and validate
    const json = await res.json(); // parse the server's JSON
    if (!json || !json.id) {
        throw new Error("Failed to create playlist");
    }
    // Return what the UI might actually use
    const webUrl = (json.external_urls && json.external_urls.spotify) ? json.external_urls.spotify : "";
    return {
        id: json.id,
        url: webUrl
    };
}

/* Add tracks to that playlist ("POST to /v1/.../playlists/{playlist_id}/tracks") */
export async function addTracksToPlaylist(playlistId, uris) { // add tracks to an existing playlist
    if (!Array.isArray(uris) || uris.length === 0) {
        return; // nothing to add, silently succeed
    }
    const body = { uris }; // build the request body Spotify expects, "provide a list of track IDs in the request body."
    const res = await spotifyFetch(`/v1/playlists/${encodeURIComponent(playlistId)}/tracks`, {
        method: "POST", // HTTP verb = create/add
        body: JSON.stringify(body)  // send JSON { uris: [...] } as the request body
    });
    if (!res.ok) throw new Error("Failed to add tracks to playlist");
}

/* Create a method that writes the user's custom playlist .. when they click 'Save To Spotify' - the async savePlaylistToSpotify function */
export async function savePlaylistToSpotify(name, uris, description = "") { // Public async function that ties all previous functions together
    if (!name || String(name). trim() === "") {     // Fail fast if the name is missing/ blank
        throw new Error("Playlist name is required");
    }
    if (!Array.isArray(uris) || uris.length === 0) {    // Ensure there's at least one track URI
        throw new Error("No tracks to save");
    }
    const userId = await getCurrentUserId(); // calls getCurrentUserId (/v1/me) to read me.id, required to create a playlist for that user
    const { id: playlistId, url } = await createPlaylist(userId, name, description); // Create the playlist - calls createPlaylist to POST /v1/users/{user_id}/playlists
    await addTracksToPlaylist(playlistId, uris); // calls addTracksToPlaylist function to POST and to add tracks to the new playlist
    return { playlistId, url }; // give the caller (user UI) the new playlist ID and its web URL
}