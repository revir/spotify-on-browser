require("imports-loader?additionalCode=var%20define%20=%20false;!../vendor/spotify-player");
import message from "./message.coffee";
import $ from "jquery";
import utils from "utils";
// import debounce from 'lodash/debounce'

window.onSpotifyWebPlaybackSDKReady = () => {
  let player;
  let trackSavedCache = {};

  let spotifyAccessToken, spotifyRefreshToken, spotifyClientId;
  console.log("Spotify Web Playback SDK is ready");

  function init() {
    if (player) return player.connect();

    player = new Spotify.Player({
      name: "Spotify on Browser",
      getOAuthToken: (cb) => {
        if (spotifyAccessToken) {
          cb(spotifyAccessToken);
          spotifyAccessToken = null; // reset the access token after being used.
        } else if (spotifyRefreshToken) refreshToken().then(cb);
        else cb();
      },
    });

    window.player = player;

    return new Promise((resolve, reject) => {
      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        reject({ message, type: "initialization_error" });
      });
      player.addListener("authentication_error", ({ message }) => {
        player.isReady = false;
        reject({ message, type: "authentication_error" });
      });
      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", async (state) => {
        // console.log('Spotify player state changed: ', state);
        player.currentState = state || null;

        utils.send("spotify state changed", {
          state: await getCurrentState(),
        });
      });

      // Ready
      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        player.isReady = true;
        player.deviceId = device_id;
        player.currentState = undefined;
        trackSavedCache = {};

        resolve({ ready: true });
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        player.isReady = false;
      });

      // Connect to the player!
      player.connect();
    });
  }

  function refreshToken() {
    const uri = "https://accounts.spotify.com/api/token";
    return $.post(uri, {
      grant_type: "refresh_token",
      refresh_token: spotifyRefreshToken,
      client_id: spotifyClientId,
    })
      .then(({ refresh_token, access_token }) => {
        spotifyRefreshToken = refresh_token;
        spotifyAccessToken = access_token;
        localStorage.setItem("spotify_refresh_token", refresh_token);
        localStorage.setItem("spotify_access_token", access_token);
        console.log("Spotify access token refreshed: ", access_token);
        return access_token;
      })
      .catch((err) => {
        console.error("spotify refresh token failed: ", err);
        localStorage.removeItem("spotify_refresh_token");
        localStorage.removeItem("spotify_access_token");
        spotifyRefreshToken = null;
        spotifyAccessToken = null;
      });
  }
  function request(uri, data, type = "GET") {
    const headers = {
      authorization: `Bearer ${localStorage.getItem("spotify_access_token")}`,
    };
    if (type != "GET") {
      headers["Accept"] = "application/json";
      headers["Content-Type"] = "application/json";
    }

    let body;
    if (data) {
      body = JSON.stringify(data);
    }

    return fetch(uri, {
      method: type,
      headers,
      body,
    })
      .then(function (response) {
        return response.json().then((res) => {
          if (res && res.error) {
            console.warn("Spotify api failed: ", res.error, uri);
          }
          return res;
        });
      })
      .catch(() => {});
  }

  function switchToThisPlayer() {
    const url = "https://api.spotify.com/v1/me/player";
    return request(
      url,
      {
        device_ids: [player.deviceId],
        play: true,
      },
      "PUT"
    );
  }

  function checkUserSavedTrack(trackId) {
    if (trackSavedCache[trackId] !== undefined) {
      return trackSavedCache[trackId];
    }

    // console.log("check saved: ", trackId, trackSavedCache);

    trackSavedCache[trackId] = request(
      "https://api.spotify.com/v1/me/tracks/contains?ids=" + trackId
    ).then((res) => {
      const r = res[0];

      trackSavedCache[trackId] = r;

      // remove after 10 minutes
      setTimeout(() => {
        trackSavedCache[trackId] = undefined;
      }, 10 * 60 * 1000);

      return r;
    });
    return trackSavedCache[trackId];
  }
  function saveUserTrack(trackId) {
    return request(
      "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
      null,
      "PUT"
    ).then((res) => {
      if (trackSavedCache[trackId] !== undefined)
        trackSavedCache[trackId] = true;

      // console.log("saved: ", trackId, trackSavedCache);
      return res;
    });
  }
  function removeUserSavedTrack(trackId) {
    return request(
      "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
      null,
      "DELETE"
    ).then((res) => {
      if (trackSavedCache[trackId] !== undefined)
        trackSavedCache[trackId] = false;

      // console.log("remove saved: ", trackId, trackSavedCache);
      return res;
    });
  }

  async function getCurrentState() {
    let state = player.currentState;
    let ready = player.isReady;

    if (player.currentState === undefined) {
      state = await player.getCurrentState();
      player.currentState = state || null;
    }

    if (!state) {
      // console.warn("Spotify user current state is empty");
      return { ready };
    }

    let { disallows, paused } = state;

    let {
      current_track,
      previous_tracks: [previous_track],
      next_tracks: [next_track],
    } = state.track_window || {};

    return {
      ready,

      disallows,
      paused,

      current_track,
      previous_track,
      next_track,
    };
  }

  message.on("spotify action", ({ action }) => {
    if (player && player.deviceId) {
      if (action === "togglePlay") {
        if (player && player.currentState && player.currentState.track_window) {
          return player.togglePlay();
        } else {
          return switchToThisPlayer().then((res) => {
            if (res && res.error) {
              console.error(
                "Spotify switch to this player failed: ",
                res.error
              );
              window.open("https://open.spotify.com/", "open spotify");
            }
          });
        }
      } else {
        return player[action]();
      }
    }
  });

  message.on(
    "spotify authorized",
    ({ refresh_token, access_token, client_id }) => {
      spotifyClientId = client_id;
      localStorage.setItem("spotify_client_id", client_id);

      spotifyRefreshToken = refresh_token;
      localStorage.setItem("spotify_refresh_token", refresh_token);

      spotifyAccessToken = access_token;
      localStorage.setItem("spotify_access_token", access_token);

      return init();
    }
  );

  message.on("get spotify current state", (request, sender) => {
    if (player && player.isReady) {
      return getCurrentState();
    }
  });

  message.on("checkUserSavedTrack", ({ trackId }) => {
    return checkUserSavedTrack(trackId);
  });
  message.on("saveUserTrack", ({ trackId }) => {
    return saveUserTrack(trackId);
  });
  message.on("removeUserSavedTrack", ({ trackId }) => {
    return removeUserSavedTrack(trackId);
  });
  message.on("toggle-feature-previous", () => {
    player && player.previousTrack();
  });
  message.on("toggle-feature-play", () => {
    player && player.togglePlay();
  });
  message.on("toggle-feature-next", () => {
    player && player.nextTrack();
  });
  message.on("toggle-feature-save", () => {
    if (player && player.currentState && player.currentState.track_window) {
      return saveUserTrack(
        player.currentState.track_window.current_track.id
      ).then(() => {
        utils.send("track saved", {
          trackId: player.currentState.track_window.current_track.id,
          trackName: player.currentState.track_window.current_track.name,
        });
      });
    }
  });

  spotifyRefreshToken = localStorage.getItem("spotify_refresh_token");
  spotifyClientId = localStorage.getItem("spotify_client_id");
  spotifyAccessToken = localStorage.getItem("spotify_access_token");

  init().then(() => {
    utils.send("spotify sdk player is ready");
  });
};
