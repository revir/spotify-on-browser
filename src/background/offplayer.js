require("imports-loader?additionalCode=var%20define%20=%20false;!../vendor/spotify-player");
import utils from "utils";
import debounce from "lodash/debounce";
import initSpotifyAPIs from "./spotify-api";
import initController from "./controller";

window.onSpotifyWebPlaybackSDKReady = () => {
  let player, reconnectPromiseResolve, reconnectPromiseReject;
  console.log("Spotify Web Playback SDK is ready");

  async function getCurrentState() {
    let state = player.currentState;
    let ready = player.isReady;
    if (!ready) return { ready, accountError: player.accountError };

    if (player?.currentState === undefined) {
      state = await player.getCurrentState();
      player.currentState = state || null;
      if (state) {
        // console.log("Got Spotify current state from the player:", state);
        await player.populateArtistInfo(state.track_window?.current_track);
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
      const currentPlaying = await player.getCurrentPlaying();
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

  async function initPlayer() {
    if (player) {
      return player.connect().then(async (success) => {
        if (success) {
          player.isReady = true;
        } else {
          player.isReady = false;
        }
        console.log("Spotify player is reconnected: ", success);
        return success;
      });
    } else {
      player = new Spotify.Player({
        name: `Spotify on ${utils.getBrowserName()}`,
        getOAuthToken: (cb) => {
          const isTokenWithinOneHour =
            localStorage.getItem("spotify_access_token") &&
            localStorage.getItem("spotify_access_token_start_at") &&
            new Date().getTime() -
              new Date(
                localStorage.getItem("spotify_access_token_start_at")
              ).getTime() <
              3600 * 1000; // 1 hour

          if (isTokenWithinOneHour) {
            cb(localStorage.getItem("spotify_access_token"));
          } else if (localStorage.getItem("spotify_refresh_token")) {
            player.refreshToken().then(cb).catch(cb);
          } else cb();
        },
      });

      window.player = player;
      initSpotifyAPIs(player);
      initController(player, initPlayer, getCurrentState, reconnectPlayer);

      return new Promise((resolve, reject) => {
        // Error handling
        player.on("initialization_error", ({ message }) => {
          player.isReady = false;
          console.error("Failed to initialize", message);
          reject({ message, type: "initialization_error" });
        });
        player.on("authentication_error", ({ message }) => {
          player.isReady = false;
          console.error("Failed to authenticate: ", message);
          localStorage.removeItem("spotify_access_token");

          function _handleAuthError() {
            reconnectPromiseReject && reconnectPromiseReject(message);
            reject({ message, type: "authentication_error" });
          }

          if (localStorage.getItem("spotify_refresh_token")) {
            player
              .refreshToken()
              .then(player.connect.bind(player))
              .catch(_handleAuthError);
          } else {
            _handleAuthError();
          }
        });
        player.on("account_error", ({ message }) => {
          player.isReady = false;
          player.accountError = message;
          console.error("Failed to validate Spotify account: ", message);
          reconnectPromiseReject && reconnectPromiseReject(message);
          reject({ message, type: "account_error" });
        });
        player.on("playback_error", ({ message }) => {
          console.error("Failed to perform playback: ", message);
        });
        player.on("autoplay_failed", () => {
          console.error(
            "Autoplay is not allowed by the browser autoplay rules"
          );
          player.autoPlayError =
            "Autoplay is not allowed by your browser. Enable AutoPlay First!";
        });

        // Playback status updates
        player.on(
          "player_state_changed",
          debounce(
            async (state) => {
              // console.log("Spotify player state changed: ", state);
              if (state?.track_window?.current_track) {
                player.currentState = state;
                await player.populateArtistInfo(
                  state.track_window.current_track
                );
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
        player.on("ready", async ({ device_id }) => {
          console.log("Ready with Device ID", device_id);
          player.isReady = true;
          player.deviceId = device_id;
          player.currentState = undefined;
          player.currentVolume = undefined;

          utils.send("spotify state changed", {
            state: await getCurrentState(),
          });

          reconnectPromiseResolve && reconnectPromiseResolve();
          resolve({ ready: true });
        });

        // Not Ready
        player.on("not_ready", ({ device_id }) => {
          console.error("Device ID has gone offline", device_id);
          player.isReady = false;
          player.deviceId = null;
          reconnectPromiseReject && reconnectPromiseReject("not_ready");
          reject({ ready: false });
        });

        if (localStorage.getItem("spotify_refresh_token")) {
          // Connect to the player!
          player.connect();
        } else {
          player.isReady = false;
          resolve({ ready: false });
        }
      });
    }
  }

  initPlayer()
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
