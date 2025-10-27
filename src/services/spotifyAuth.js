/* MODULE FOR GETTING ACCESS TOKEN */

// PKCE flow: exchanges ?code for access token, caches until expiry

let token = null; // current access token (string) or null
let expiresAt = 0; 

/* Add build-time configuration */
// The public identifier obtained from the Spotify Dashboard
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// The exact URL should send the user back to after login
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/" /* This is a fallback, for cases where the env isn't set */;
// A space-separated list of permissions the app requests
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES || "playlist-modify-public";

/* Random PKCE verifier string */
function generateVerifier(len = 64) {
    // Allowed PKCE characters (RFC)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    // Make an array of `len` random bytes using a cryptographically secure RNG
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    // Turn each random byte into a character index inside `chars`, then join the characters
    // into a string
    return Array.from(bytes, b => chars[b % chars.length]).join("");
}

/* b64url function to convert binary data to base64url (URL-safe base64) */
function b64url(buf) {
    // Convert ArrayBuffer to a string of bytes and then to base64 text
    // `btoa` expects a regular string, so we first build one from the bytes
    let s = btoa(String.fromCharCode(...new Uint8Array(buf)));
    // Make it URL-safe (base64url): replace '+' with '-', '/' with '_', and strip '=' padding    
    return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, ""); // (/\+/g, "-") - this is a regular expression (regex), the '/''s are regex delimiters,
                                                                          // '\+' is the literal plus sign. In regex, + means "one or more", so we escape it with
                                                                          // a backslash to mean the actual + character. 'g' - global flag: replace all matches, not just
                                                                          // the first. "-" - the replacement string (a hyphen)
}

/* We send the challenge to Spotify now, and later prove ourselves by sending back the original verifier */

/* challengeFromVerfier function to hash the verifier for the PKCE code_challenge */
async function challengeFromVerifier(verifier) {
    // Turn the verifier string into bytes (UTF-8)
    const data = new TextEncoder().encode(verifier);
    // SHA-256 hash the bytes (returns an ArrayBuffer)
    const digest = await crypto.subtle.digest("SHA-256", data);
    // Convert the binary hash into base64url for the URL
    return b64url(digest);
}

/* The page navigates away to Spotify and comes back; `sessionStorage` survives that single tab sesion
so we can complete the exchange */
function saveVerifier(v) {
    sessionStorage.setItem("pkce_verifier", v); // write once
}
function loadVerifier() {
    return sessionStorage.getItem("pkce_verifier"); // read on return
}
function clearVerifier() {
    sessionStorage.removeItem("pkce_verifier"); // clean up after use
}

/* To avoid keeping sensitive/expired params in URL and prevent accidental re-processing on refresh, we need
a function that removes ?code=... (and friends from the address bar) - clearQuery function */
function clearQuery() {
    if (history.replaceState) {
        // Build a clean URL without the query string and replace the current entry.
        const clean = location.origin + location.pathname;
        history.replaceState({}, document.title, clean);
    } else {
        // Fallback: navigating to the same page without query
        location.search = "";
    }
}

/* Spotify authorize URL function built with PKCE parameters */
async function authorizeUrl() {
    // Create verifier+challenge and remember the verifier
    const verifier = generateVerifier();
    saveVerifier(verifier);
    const challenge = await challengeFromVerifier(verifier);

    // Fill all required OAuth + PKCE params
    const p = new URLSearchParams({
        client_id: CLIENT_ID,   // identifies our app to Spotify
        response_type: "code",   // PKCE uses an authorization code (not a token)
        redirect_uri: REDIRECT_URI, // must match the Spotify dashboard setting
        scope: SCOPES,              // permissions we request (space-separated)
        code_challenge_method: "S256", // SHA-256 for PKCE
        code_challenge: challenge     // the hashed verifier we just computed 
    });
    // Return the full /authorize URL to navigate to
    return `https://accounts.spotify.com/authorize?${p.toString()}`;
}

/* The exchangeCodeForToken turns a short-lived code into a token we can use in API calls */
async function exchangeCodeForToken(code) {
    const verifier = loadVerifier();
    if (!verifier) throw new Error("Missing PKCE verifier in session.");

    // Build the x-www-form-urlencoded POST body Spotify expects
    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code", // OAuth grant we're using
        code,                           // the ?code=... Sporify just gave us
        redirect_uri: REDIRECT_URI,     // must match again
        code_verifier: verifier,        // proves we are the same client
    });

    // Call Spotify's token endpoint to obtain an access token
    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    // Good error messages help a lot while learning
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Token exchange failed: ${res.status} ${res.statusText}\n${text}`);
    }

    // Parse the token response and cache token + expiry (with a 5s safety buffer)
    const json = await res.json();              // { access_token, expires_in, ... }
    token = json.access_token || null;
    const expSec = Number(json.expires_in || 0); // seconds
    expiresAt = token && expSec > 0 ? Date.now() + expSec * 1000 - 5000 : 0;

    //One-time use: clean up verifier and tidy the URL
    clearVerifier();
    clearQuery();
}

/* The readCodeFromUrlAndExchange function is called on every getAccessToken() run se we aut-complete
the flow when coming back from Spotify. It detects `?code=...` and performs the exchange */
async function readCodeFromUrlAndExchange() {
    // If there's no query string at all, nothing to do
    if (!location.search) return false;
    // Read params (?code=..., ?error=..., etc.)
    const qs = new URLSearchParams(location.search);
    const err = qs.get("error");
    if (err) throw new Error(`Auth error: ${err}`);
    // If we have a code, exchange it now
    const code = qs.get("code");
    if (!code) return false;
    await exchangeCodeForToken(code);
    return true; // We handled a code
}

/* Here's the heart of the flow: a single function that always leaves a user with a valid
token or in the middle of a redirect to Spotify to get one. */

/* CONSIDERATIONS:
    - Do we already have a fresh token in memory?
    - If not, are we just returning from Spotify with a token in the URL?
    - If not, start the login/consent redirect */

/* The getAccessToken is the single public entry to guarantee a valid token. UI code calls this whenever it needs a token;
it hides all the PKCE details */
export async function getAccessToken() {
    // Fast path: if we already have a fresh token, return it
    if (token && Date.now() < expiresAt) return token;

    // If we just returned from Spotify with ?code=..., exchange it
    try {
        const handled = await readCodeFromUrlAndExchange();
        if (handled && token && Date.now() < expiresAt) return token;
    } catch (e) {
        console.error(e); // show any auth errors in the console
    }

    // If there's still no token, start the PKCE login by redirecting
    if (!CLIENT_ID) throw new Error("Missing VITE_SPOTIFY_CLIENT_ID in .env");
    const url = await authorizeUrl();  // build URL with PKCE challenge
    window.location.assign(url);       // navigate away to Spotify
    return undefined;               // nothing to return
}

/* Authenticated fetch - one function, one responsibility: ensure a token and call `fetch` with
the right headers */

/* Authenticated fetch for Spotify endpoints */
export async function spotifyFetch(pathOrUrl, init = {}) {
    // Ensure we have a valid login
    const t = await getAccessToken();
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