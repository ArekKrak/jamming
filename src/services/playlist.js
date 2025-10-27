/* THIS IS A SERVICE THAT TALKS TO SPOTIFY AND MAKES REQUESTS TO CREATE NEW PLAYLISTS */

import { spotifyFetch } from "./spotifyAuth"; // Make requests to create new playlists.

/* Get the current user's Spotify ID ("you'll need the user's ID...") */
export async function getCurrentUserId() {
    const res = await spotifyFetch("/v1/me") // GET current user
    const me = await res.json();
    if (!me || !me.id) throw new Error("Could not read user id from /v1/me");
    return me.id;       // e.g. "arekk..."
}