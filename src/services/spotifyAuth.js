/* MODULE FOR GETTING ACCESS TOKEN */

// PKCE flow: parses token from URL hash, caches until expiry

let token = null; // current access token (string) or null
let expiresAt = 0; 

/* Add build-time configuration */
// The public identifier obtained from the Spotify Dashboard
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
// The exact URL should send the user back to after login
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || window.location.origin + "/" /* This is a fallback, for cases where the env isn't set */;
// A space-separated list of permissions the app requests
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES || "playlist-modify-public";

function generateVerifier(len = 64) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    const bytes = new Uint8Array(len);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => chars[b % chars.length]).join("");
}
function b64url(buf) {
    let s = btoa(String.fromCharCode(...new Uint8Array(buf)));
    return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
async function challengeFromVerifier(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return b64url(digest);
}
function saveVerifier(v){ sessionStorage.setItem("pkce_verifier", v); }
function loadVerifier(){ return sessionStorage.getItem("pkce_verifier"); }
function clearVerifier(){ sessionStorage.removeItem("pkce_verifier"); }

function clearQuery() {
    if (history.replaceState) {
        const clean = location.origin + location.pathname;
        history.replaceState({}, document.title, clean);
    } else {
        location.search = "";
    }
}

/* Spotify authorize URL function */
async function authorizeUrl() {
    const verifier = generateVerifier();
    saveVerifier(verifier);
    const challenge = await challengeFromVerifier(verifier);

    const p = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",   // CHANGED from "token"
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        code_challenge_method: "S256",
        code_challenge: challenge,
    });
    return `https://accounts.spotify.com/authorize?${p.toString()}`;
}

async function exchangeCodeForToken(code) {
    const verifier = loadVerifier();
    if (!verifier) throw new Error("Missing PKCE verifier in session.");

    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Token exchange failed: ${res.status} ${res.statusText}\n${text}`);
    }

    const json = await res.json();
    token = json.access_token || null;
    const expSec = Number(json.expires_in || 0);
    expiresAt = token && expSec > 0 ? Date.now() + expSec * 1000 - 5000 : 0;

    clearVerifier();
    clearQuery();
}

async function readCodeFromUrlAndExchange() {
    if (!location.search) return false;
    const qs = new URLSearchParams(location.search);
    const err = qs.get("error");
    if (err) throw new Error(`Auth error: ${err}`);
    const code = qs.get("code");
    if (!code) return false;
    await exchangeCodeForToken(code);
    return true;
}

/* Here's the heart of the flow: a single function that always leaves a user with a valid
token or in the middle of a redirect to Spotify to get one. */

/* CONSIDERATIONS:
    - Do we already have a fresh token in memory?
    - If not, are we just returning from Spotify with a token in the URL?
    - If not, start the login/consent redirect */

/* Get a valid token or redirect to Spotify */
export async function getAccessToken() {
    if (token && Date.now() < expiresAt) return token;

    try {
        const handled = await readCodeFromUrlAndExchange();
        if (handled && token && Date.now() < expiresAt) return token;
    } catch (e) {
        console.error(e);
    }

    if (!CLIENT_ID) throw new Error("Missing VITE_SPOTIFY_CLIENT_ID in .env");
    const url = await authorizeUrl();  // now async
    window.location.assign(url);
    return undefined; // navigating
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