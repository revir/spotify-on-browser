import message from "./message.coffee";
import utils from "utils";

// Helper to wait for player to be ready with deviceId
const waitForPlayer = (player, maxRetries = 20, interval = 100) => {
  return new Promise((resolve, reject) => {
    let retries = 0;
    const check = () => {
      if (player && player.deviceId) {
        resolve(player);
      } else if (retries >= maxRetries) {
        reject(new Error("Player not ready after max retries"));
      } else {
        retries++;
        setTimeout(check, interval);
      }
    };
    check();
  });
};

export default (player, initPlayer, getCurrentState, reconnectPlayer) => {
  message.on(
    "spotify authorized",
    ({ refresh_token, access_token, client_id }) => {
      localStorage.setItem("spotify_client_id", client_id);
      localStorage.setItem("spotify_refresh_token", refresh_token);
      localStorage.setItem("spotify_access_token", access_token);
      localStorage.setItem(
        "spotify_access_token_start_at",
        new Date().toISOString(),
      );

      return initPlayer().finally(async () => {
        utils.send("spotify state changed", {
          state: await getCurrentState(),
        });
      });
    },
  );

  message.on("offscreen spotify action", async ({ action, value }) => {
    // Wait for player to be ready with deviceId
    try {
      await waitForPlayer(player);
    } catch (e) {
      console.error("Player not ready:", e);
      return;
    }

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
                res.error,
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
                "spotify_current_volume",
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
      if (action === "seek") {
        return player.seek(value);
      }
      if (action === "playContext") {
        return player.playContext(value);
      }
      return player[action](value);
    }
  });

  message.on("get spotify current state", () => {
    return getCurrentState();
  });

  message.on("get spotify current playing", () => {
    return player?.getCurrentPlaying();
  });

  message.on("offscreen checkUserSavedTrack", ({ trackId }) => {
    return player?.checkUserSavedTrack(trackId);
  });
  message.on("offscreen saveUserTrack", ({ trackId }) => {
    return player?.saveUserTrack(trackId);
  });
  message.on("offscreen removeUserSavedTrack", ({ trackId }) => {
    return player?.removeUserSavedTrack(trackId);
  });
  message.on("offscreen getPlaylists", () => {
    return player?.getPlaylists();
  });
  message.on("offscreen getSavedShows", () => {
    return player?.getSavedShows();
  });
  message.on("offscreen getSavedAlbums", () => {
    return player?.getSavedAlbums();
  });
  message.on("offscreen getFeaturedPlaylists", () => {
    return player?.getFeaturedPlaylists();
  });
  message.on("offscreen getQueue", () => {
    return player?.getQueue();
  });
  message.on("offscreen toggle-feature-previous", async () => {
    try {
      await waitForPlayer(player);
      player.previousTrack();
    } catch (e) {
      console.error("Player not ready:", e);
    }
  });
  message.on("offscreen toggle-feature-play", async () => {
    try {
      await waitForPlayer(player);
      player.togglePlay();
    } catch (e) {
      console.error("Player not ready:", e);
    }
  });
  message.on("offscreen toggle-feature-next", async () => {
    try {
      await waitForPlayer(player);
      player.nextTrack();
    } catch (e) {
      console.error("Player not ready:", e);
    }
  });
  message.on("offscreen toggle-feature-save", async () => {
    try {
      await waitForPlayer(player);
      if (player.currentState && player.currentState.track_window) {
        return player
          .saveUserTrack(player.currentState.track_window.current_track.id)
          .then(() => {
            utils.send("track saved", {
              trackId: player.currentState.track_window.current_track.id,
              trackName: player.currentState.track_window.current_track.name,
            });
          });
      }
    } catch (e) {
      console.error("Player not ready:", e);
    }
  });
};
