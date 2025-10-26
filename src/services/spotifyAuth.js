let token = null; // current access token (string) or null
let expiresAt = 0; 

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

/* Clear #... from the URL after parse function */
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

/* Read token from URL when coming back from Spotify */
function readTokenFromUrl() {
    // Guard - if there's no #... there's no "coming back from Spotify"
    if (!window.location.hash) return;
    // Safe parsing - window.location.hash includes #, so it's sliced off and URLSearchParams does decoding, edge cases, etc.
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const t = hash.get("access_token"); // string or null
    const expSec = Number(hash.get("expires_in") || "0") // in seconds, not milliseconds
    // Validate - only proceed if both are present and the expires_in value is a positive number
    if (t && expSec > 0) {
        // Compute absolute expiry, "expiresAt" = "now" + lifetime in ms, minus a tiny safety buffer
        // A safety buffer helps avoid edge cases where the token might expire at when attempted to use.
        token = t;
        expiresAt = Date.now() + expSec * 1000 - 5000;
        // Clean up URL - call clearHash()
        clearHash();
    }
}