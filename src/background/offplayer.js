require("imports-loader?additionalCode=var%20define%20=%20false;!../vendor/spotify-player");
import message from "./message.coffee";
import utils from "utils";
import debounce from "lodash/debounce";

window.onSpotifyWebPlaybackSDKReady = () => {
  let player, reconnectPromiseResolve, reconnectPromiseReject;
  let trackSavedCache = {};

  let spotifyAccessToken, spotifyRefreshToken, spotifyClientId;
  console.log("Spotify Web Playback SDK is ready");

  async function reconnectPlayer() {
    console.log("Try to reconnect the player");
    await player.disconnect();
    player.isReady = false;

    let _timer;
    const reconnectPromise_ = new Promise((resolve, reject) => {
      reconnectPromiseResolve = resolve;
      reconnectPromiseReject = reject;
      _timer = setTimeout(() => {
        console.warn("Reconnect timeout...");
        resolve();
      }, 2000);
    });

    const success = await player.connect();
    console.log("Spotify player is reconnected: ", success);
    if (success) {
      player.isReady = true;
      console.log("Waiting for the player to be ready...");
    } else {
      reconnectPromiseReject({ success: false });
    }

    return reconnectPromise_
      .then(() => clearTimeout(_timer))
      .catch(async (err) => {
        clearTimeout(_timer);
        console.error("Spotify player is not reconnected: ", err);
        utils.send("spotify state changed", {
          state: await getCurrentState(),
        });
        throw err;
      });
  }

  async function init() {
    if (player)
      return player.connect().then(async (success) => {
        if (success) {
          player.isReady = true;
        } else {
          player.isReady = false;
        }
        console.log("Spotify player is reconnected: ", success);
        return success;
      });

    player = new Spotify.Player({
      name: `Spotify on ${utils.getBrowserName()}`,
      getOAuthToken: (cb) => {
        if (spotifyAccessToken) {
          cb(spotifyAccessToken);
        } else if (spotifyRefreshToken) refreshToken().then(cb).catch(cb);
        else cb();
      },
    });

    window.player = player;

    return new Promise((resolve, reject) => {
      // Error handling
      player.addListener("initialization_error", ({ message }) => {
        player.isReady = false;
        console.error("Failed to initialize", message);
        reject({ message, type: "initialization_error" });
      });
      player.addListener("authentication_error", ({ message }) => {
        player.isReady = false;
        spotifyAccessToken = null;
        console.error("Failed to authenticate: ", message);
        reconnectPromiseReject && reconnectPromiseReject(message);
        reject({ message, type: "authentication_error" });
      });
      player.addListener("account_error", ({ message }) => {
        player.isReady = false;
        player.accountError = message;
        console.error("Failed to validate Spotify account: ", message);
        reconnectPromiseReject && reconnectPromiseReject(message);
        reject({ message, type: "account_error" });
      });
      player.addListener("playback_error", ({ message }) => {
        console.error("Failed to perform playback: ", message);
      });
      player.addListener("autoplay_failed", () => {
        console.error("Autoplay is not allowed by the browser autoplay rules");
        player.autoPlayError =
          "Autoplay is not allowed by your browser. Enable AutoPlay First!";
      });

      // Playback status updates
      player.addListener(
        "player_state_changed",
        debounce(
          async (state) => {
            // console.log("Spotify player state changed: ", state);
            if (state?.track_window?.current_track) {
              player.currentState = state;
              await populateArtistInfo(state.track_window.current_track);
              localStorage.setItem(
                "spotify_current_state",
                JSON.stringify(state)
              );
            } else {
              player.currentState = null;
              localStorage.removeItem("spotify_current_state");
            }

            utils.send("spotify state changed", {
              state: await getCurrentState(),
            });
          },
          500,
          { leading: true }
        )
      );

      // Ready
      player.addListener("ready", async ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        player.isReady = true;
        player.deviceId = device_id;
        player.currentState = undefined;
        player.currentVolume = undefined;
        trackSavedCache = {};

        utils.send("spotify state changed", {
          state: await getCurrentState(),
        });

        reconnectPromiseResolve && reconnectPromiseResolve();
        resolve({ ready: true });
      });

      // Not Ready
      player.addListener("not_ready", ({ device_id }) => {
        console.error("Device ID has gone offline", device_id);
        player.isReady = false;
        player.deviceId = null;
        reconnectPromiseReject && reconnectPromiseReject("not_ready");
        reject({ ready: false });
      });

      if (spotifyClientId && spotifyRefreshToken) {
        // Connect to the player!
        player.connect();
      } else {
        player.isReady = false;
        resolve({ ready: false });
      }
    });
  }

  function refreshToken() {
    const uri = "https://accounts.spotify.com/api/token";
    return fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: spotifyRefreshToken,
        client_id: spotifyClientId,
      }),
    })
      .then((response) => response.json())
      .then(({ refresh_token, access_token }) => {
        spotifyRefreshToken = refresh_token;
        spotifyAccessToken = access_token;
        localStorage.setItem("spotify_refresh_token", refresh_token);
        localStorage.setItem("spotify_access_token", access_token);
        // console.log("Spotify access token refreshed: ", access_token);
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
        if (response.status === 204) {
          console.log("Spotify api request success with no content", uri);
          return;
        }
        return response
          .json()
          .then((res) => {
            if (res && res.error) {
              console.warn("Spotify api failed: ", res.error, uri);
            }
            return res;
          })
          .catch((err) => {
            if (response.ok) {
              return;
            }
            console.error(
              "Spotify api parse response failed: ",
              err,
              uri,
              response
            );
            return { error: err, status: response.status };
          });
      })
      .catch((err) => {
        console.error("Spotify api request failed: ", err, type, uri, body);
        return { error: err };
      });
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

  function getCurrentPlaying() {
    const uri = "https://api.spotify.com/v1/me/player/currently-playing";
    return request(uri).then((res) => {
      if (res) {
        if (res.error) {
          console.error(
            "Spotify get current playing track failed: ",
            res.error
          );
          return;
        }
        if (!res.item) {
          return;
        }

        let {
          is_playing,
          item,
          currently_playing_type,
          actions: { disallows },
        } = res;

        return {
          paused: !is_playing,
          track: item,
          currently_playing_type,
          disallows,
        };
      }
    });
  }
  function populateArtistInfo(track) {
    if (!track?.artists[0]?.uri || track.artistInfo) {
      return;
    }
    const artistId = track.artists[0].uri.split(":").pop();
    const cached = localStorage.getItem("spotify_artist_info");
    if (cached && JSON.parse(cached).id === artistId) {
      track.artistInfo = JSON.parse(cached);
      return track.artistInfo;
    }

    const uri = `https://api.spotify.com/v1/artists/${artistId}`;
    return request(uri).then((res) => {
      if (res) {
        if (res.error) {
          console.warn("Spotify get artist info failed: ", res.error);
          return;
        }
        localStorage.setItem("spotify_artist_info", JSON.stringify(res));
        track.artistInfo = res;
        // console.log("Got Spotify artist info: ", res, artistId);
        return res;
      }
    });
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
    if (!ready) return { ready, accountError: player.accountError };

    if (player?.currentState === undefined) {
      state = await player.getCurrentState();
      player.currentState = state || null;
      if (state) {
        // console.log("Got Spotify current state from the player:", state);
        await populateArtistInfo(state.track_window?.current_track);
        localStorage.setItem("spotify_current_state", JSON.stringify(state));
      }
    }

    if (!player.currentVolume) {
      const savedVolume = localStorage.getItem("spotify_current_volume");
      const volume = savedVolume || (await player.getVolume());
      if (volume != null) player.currentVolume = volume;
    }
    // console.log("Spotify current volume: ", player.currentVolume);

    if (!state) {
      const currentPlaying = await getCurrentPlaying();
      if (currentPlaying) {
        return { ready, currentPlaying };
      } else {
        state = JSON.parse(localStorage.getItem("spotify_current_state"));
        player.currentState = state || null;
        if (state) {
          state.paused = true;
        }
      }
    }

    if (state) {
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
        currentVolume: player.currentVolume,

        autoPlayError: player.autoPlayError,
      };
    } else {
      return { ready, autoPlayError: player.autoPlayError };
    }
  }

  message.on("spotify action", async ({ action, value }) => {
    if (player && player.deviceId) {
      if (action === "togglePlay") {
        const state = await player.getCurrentState();
        player.currentState = state || null;
        player.autoPlayError = null;

        if (player.currentState?.track_window?.current_track) {
          return player.togglePlay();
        } else {
          async function tryToPlay(retry = 0) {
            await switchToThisPlayer().then(async (res) => {
              if (res && res.error) {
                console.error(
                  "Spotify switch to this player failed: ",
                  res.error
                );
                if (res.error.status > 400 && res.error.status < 500) {
                  if (res.error.status === 404 && retry < 1) {
                    await reconnectPlayer();
                    return tryToPlay(retry + 1);
                  } else if (res.error.status === 401 && retry < 1) {
                    spotifyAccessToken = null;
                    await reconnectPlayer();
                    return tryToPlay(retry + 1);
                  }
                }
                console.warn("Reloading the extension...");
                chrome.runtime.reload();
              } else {
                const savedVolume = localStorage.getItem(
                  "spotify_current_volume"
                );
                if (savedVolume) {
                  player.currentVolume = savedVolume;
                  player.setVolume(savedVolume);
                }
              }
            });
          }
          return tryToPlay();
        }
      } else {
        if (action === "setVolume") {
          player.currentVolume = value;
          localStorage.setItem("spotify_current_volume", value);
        }
        return player[action](value);
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

      return init().finally(async () => {
        utils.send("spotify state changed", {
          state: await getCurrentState(),
        });
      });
    }
  );

  message.on("get spotify current state", () => {
    return getCurrentState();
  });

  message.on("get spotify current playing", () => {
    return getCurrentPlaying();
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

  init()
    .then(() => {
      if (utils.isFirefox()) {
        global.spotifyWebPlaybackSDKResolver();
      } else {
        utils.send("spotify sdk player is ready");
      }
    })
    .catch((err) => {
      console.error("Spotify sdk init failed: ", err);
      if (utils.isFirefox()) {
        global.spotifyWebPlaybackSDKResolver(err);
      } else {
        utils.send("spotify sdk player is ready", err);
      }
    });
};
