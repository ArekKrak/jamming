let token = null; // current access token (string) or null
let expireAt = 0; 

/* Add build-time configuration */
// The public identifier obtained from the Spotify Dashboard
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// The exact URL should send the user back to after login
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/" /* This is a fallback, for cases where the env isn't set */;
// A space-separated list of permissions the requests
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES || "playlist-modify-public";

/* Spotify authorize URL function */
function authorizeUrl() {
    const p = new URLSearchParams({ // Build an authorize URL with parameters (client_id, redirect_uri, scope, etc.) and read parameters Spotify sends back (access_token, expires_in, etc.)
        client_id: CLIENT_ID, // tells Spotify which app is requesting access (ID from the dashboard)
        response_type: "token", // selects the Implicit Grant flow
        redirect_uri: REDIRECT_URI, // must match the one registered in Spotify app
        scope: SCOPES // permissions
    });
    return `https://accounts.spotify.com/authorize?${p.toString()}`;
}

/* Clear #... from the URL after parse */
function clearHash() {
    // Check that the History API exists
    if (window.history && window.history.replaceState) {
        // Reconstruct the URL without the fragment #...
        const clean = window.location.origin + window.location.pathname + window.location.search;
        // Replace the current history entry's URL with the clean one, no #...
        window.history.replaceState({}, document.title, clean);
    } else {
        window.location.hash = ""; // Safety fallback
    }
}

/* When to call clearHash() ?
- Immediately after parsing the token and expiry from the hash. */