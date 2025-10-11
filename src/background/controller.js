import message from "./message.coffee";
import utils from "utils";

export default (player, initPlayer, getCurrentState, reconnectPlayer) => {
  message.on(
    "spotify authorized",
    ({ refresh_token, access_token, client_id }) => {
      localStorage.setItem("spotify_client_id", client_id);
      localStorage.setItem("spotify_refresh_token", refresh_token);
      localStorage.setItem("spotify_access_token", access_token);
      localStorage.setItem(
        "spotify_access_token_start_at",
        new Date().toISOString()
      );

      return initPlayer().finally(async () => {
        utils.send("spotify state changed", {
          state: await getCurrentState(),
        });
      });
    }
  );

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
            await player.switchToThisPlayer().then(async (res) => {
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
                    localStorage.removeItem("spotify_access_token");
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

  message.on("get spotify current state", () => {
    return getCurrentState();
  });

  message.on("get spotify current playing", () => {
    return player?.getCurrentPlaying();
  });

  message.on("checkUserSavedTrack", ({ trackId }) => {
    return player?.checkUserSavedTrack(trackId);
  });
  message.on("saveUserTrack", ({ trackId }) => {
    return player?.saveUserTrack(trackId);
  });
  message.on("removeUserSavedTrack", ({ trackId }) => {
    return player?.removeUserSavedTrack(trackId);
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
      return player
        .saveUserTrack(player.currentState.track_window.current_track.id)
        .then(() => {
          utils.send("track saved", {
            trackId: player.currentState.track_window.current_track.id,
            trackName: player.currentState.track_window.current_track.name,
          });
        });
    }
  });
};
