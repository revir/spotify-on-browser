import PKCE from "js-pkce/dist/browser.min.js";
import utils from "utils";

// const scope = ["streaming", "user-read-email", "user-read-private", "user-library-read", "user-library-modify", "user-read-recently-played", "user-modify-playback-state"].join(" ");
const scope = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-modify-playback-state",
  "user-read-currently-playing",
].join(" ");
const redirectUri = "https://pnl.dev/spotify-on-browser?spotifyCallback";
const spotifyClientId = "71996e28dc6f40cc89f05bd0b030708e";

const pkce = new PKCE({
  client_id: spotifyClientId,
  redirect_uri: redirectUri,
  authorization_endpoint: "https://accounts.spotify.com/authorize",
  token_endpoint: "https://accounts.spotify.com/api/token",
  requested_scopes: scope,
});

function authorize() {
  window.location.replace(pkce.authorizeUrl());
}

async function onAuthorized() {
  const { error, query, state, code } = await pkce.parseAuthResponseUrl(
    window.location.href
  );
  if (error) {
    alert("Error returned from spotify authorization server: " + error);
  } else {
    return getAccessToken();
  }
}

async function getAccessToken() {
  try {
    const { access_token, refresh_token } = await pkce.exchangeForAccessToken(
      window.location.href
    );
    return { access_token, refresh_token };
  } catch (err) {
    alert("Error from spotify authorization: " + err);
  }
}

(async function () {
  if (
    window.location.host === "pnlpal.dev" ||
    window.location.host === "pnl.dev"
  ) {
    const url = chrome.runtime.getURL("authorized.html");
    window.location.replace(url + location.search);
  } else if (window.location.search.includes("spotifyCallback")) {
    const res = await onAuthorized();
    if (res?.access_token) {
      document.getElementById("authorizing-title").hidden = true;
      document.getElementById("authorized-title").hidden = false;

      utils.send("spotify authorized", {
        access_token: res.access_token,
        refresh_token: res.refresh_token,
        client_id: spotifyClientId,
      });

      setTimeout(() => {
        window.location.replace("option.html?needAutoPlay");
      }, 500);
    }
  } else {
    document.getElementById("authorized-title").hidden = true;
    authorize();
  }
})();
