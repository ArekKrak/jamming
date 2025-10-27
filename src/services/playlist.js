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