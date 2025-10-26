/* MODULE FOR GETTING ACCESS TOKEN */

// Implicit Grant flow: parses token from URL hash, caches until expiry

let token = null; // current access token (string) or null
let expiresAt = 0; 

/* Add build-time configuration */
// The public identifier obtained from the Spotify Dashboard
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// The exact URL should send the user back to after login
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/" /* This is a fallback, for cases where the env isn't set */;
// A space-separated list of permissions the app requests
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
    const expSec = Number(hash.get("expires_in") || "0"); // in seconds, not milliseconds
    // Validate - only proceed if both are present and the expires_in value is a positive number
    if (t && expSec > 0) {
        // Compute absolute expiry, "expiresAt" = "now" + lifetime in ms, minus a tiny safety buffer
        // A safety buffer helps avoid edge cases where the token might expire right when we try to use it
        token = t;
        expiresAt = Date.now() + expSec * 1000 - 5000;
        // Clean up URL - call clearHash()
        clearHash();
    }
}

/* Here's the heart of the flow: a single function that always leaves a user with a valid
token or in the middle of a redirect to Spotify to get one. */

/* CONSIDERATIONS:
    - Do we already have a fresh token in memory?
    - If not, are we just returning from Spotify with a token in the URL?
    - If not, start the login/consent redirect */

/* Get a valid token or redirect to Spotify */
export function getAccessToken() {
    // The fastest way to decide if still valid
    if (token && Date.now() < expiresAt) {
        return token; // fast path, good to go
    }
    // Just came back from Spotify? Parse hash once and cache values if present
    readTokenFromUrl();
    if (token && Date.now() < expiresAt) {
        return token;
    }
    // If still no token, the Implicit Grant flow is needed
    if (!CLIENT_ID) {
        throw new Error("Missing VITE_SPOTIFY_CLIENT_ID in .env (restart dev server after editing .env).");
    }
    window.location.assign(authorizeUrl());
}

/* Authenticated fetch - one function, one responsibility: ensure a token and call `fetch` with
the right headers */

/* Authenticated fetch for Spotify endpoints */
export async function spotifyFetch(pathOrUrl, init = {}) {
    // Ensure we have a valid login
    const t = getAccessToken();
    if (!t) return new Promise(() => {});
    // Flexible URL: use "/v1/..." most of the time
    const url = pathOrUrl.startsWith("http") ? pathOrUrl : `https://api.spotify.com${pathOrUrl}`;
    // Call fetch with Authorization header
    const res = await fetch(url, {
        // let callers override defaults
        ...init,
        headers: {
            Authorization: `Bearer ${t}`,   // required by Spotify
            "Content-Type": "application/json", // fine for GET; needed for JSON POST/PUT
            ...(init.headers || {})            // allow caller overrides
        }
    });

    if (!res.ok) {
        let body = "";
        try {
            // clone() so we can read the body here without consuming it for the caller (defensive)
            body = await res.clone().text();
        } catch {
            // ignore parse issues; body stays ""
        }
        throw new Error(`Spotify ${res.status} ${res.statusText} at ${url}\n${body}`);
    }
    // Return the Response so the caller chooses how to parse (json/text/arrayBuffer)
    return res;
}