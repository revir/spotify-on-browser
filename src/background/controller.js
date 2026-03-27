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
  const play = async () => {
    const state = await player.getCurrentState();
    player.currentState = state || null;
    player.autoPlayError = null;
    player.playError = null;

    if (player.currentState?.track_window?.current_track) {
      return player.togglePlay();
    } else {
      async function tryToPlay(retry = 0) {
        await player.switchToThisPlayer().then(async (res) => {
          if (res && res.error) {
            console.error("Spotify switch to this player failed: ", res.error);
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
            console.warn(
              "Failed to switch playback to this player:",
              res.error,
            );
            // Fallback: play user's liked songs
            console.log("Fallback: playing user's liked songs");
            await player
              .playContext("spotify:user:me:collection")
              .catch(async (e) => {
                console.error("Fallback play also failed:", e);
                player.playError =
                  "Failed to play. Please try playing a track from Spotify app first.";

                utils.send("spotify state changed", {
                  state: await getCurrentState(),
                });
              });
          } else {
            const savedVolume = localStorage.getItem("spotify_current_volume");
            if (savedVolume) {
              player.currentVolume = savedVolume;
              player.setVolume(savedVolume);
            }
          }
        });
      }
      return tryToPlay();
    }
  };
  const handleAuthError = async (res) => {
    if (res?.status === 401 || res?.error?.status === 401) {
      localStorage.removeItem("spotify_access_token");
      await reconnectPlayer();
    }
    return res;
  };

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
      return play();
    } else {
      if (action === "setVolume") {
        player.currentVolume = value;
        localStorage.setItem("spotify_current_volume", value);
      }
      if (action === "seek") {
        return player.seek(value);
      }
      if (action === "playContext") {
        return player.playContext(value).then(handleAuthError);
      }
      if (action === "playTrack") {
        return player.playTrack(value).then(handleAuthError);
      }
      // Use Web API for next/previous - works for podcasts
      if (action === "nextTrack") {
        return player.skipToNext().then(handleAuthError);
      }
      if (action === "previousTrack") {
        return player.skipToPrevious().then(handleAuthError);
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
    return player?.saveUserTrack(trackId).then(handleAuthError);
  });
  message.on("offscreen removeUserSavedTrack", ({ trackId }) => {
    return player?.removeUserSavedTrack(trackId).then(handleAuthError);
  });
  // Episode (podcast) handlers
  message.on("offscreen checkUserSavedEpisode", ({ episodeId }) => {
    return player?.checkUserSavedEpisode(episodeId);
  });
  message.on("offscreen saveUserEpisode", ({ episodeId }) => {
    return player?.saveUserEpisode(episodeId).then(handleAuthError);
  });
  message.on("offscreen removeUserSavedEpisode", ({ episodeId }) => {
    return player?.removeUserSavedEpisode(episodeId).then(handleAuthError);
  });
  message.on("offscreen getPlaylists", () => {
    return player?.getPlaylists().then(handleAuthError);
  });
  message.on("offscreen getSavedShows", () => {
    return player?.getSavedShows().then(handleAuthError);
  });
  message.on("offscreen getSavedEpisodes", () => {
    return player?.getSavedEpisodes().then(handleAuthError);
  });
  message.on("offscreen playUris", ({ uris }) => {
    return player?.playUris(uris).then(handleAuthError);
  });
  message.on("offscreen getSavedAlbums", () => {
    return player?.getSavedAlbums().then(handleAuthError);
  });
  message.on("offscreen getFeaturedPlaylists", () => {
    return player?.getFeaturedPlaylists().then(handleAuthError);
  });
  message.on("offscreen getQueue", () => {
    return player?.getQueue();
  });
  message.on("offscreen setShuffle", ({ state }) => {
    return player?.setShuffle(state);
  });
  message.on("offscreen setRepeatMode", ({ state }) => {
    return player?.setRepeatMode(state);
  });
  message.on("offscreen clear auth", () => {
    // Clear tokens to force re-authorization for new scopes
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
  });
  message.on("offscreen toggle-feature-previous", async () => {
    try {
      await waitForPlayer(player);
      // Use Web API instead of SDK - works for podcasts
      player.skipToPrevious();
    } catch (e) {
      console.error("Player not ready:", e);
    }
  });
  message.on("offscreen toggle-feature-play", async () => {
    try {
      await waitForPlayer(player);
      play();
    } catch (e) {
      console.error("Player not ready:", e);
    }
  });
  message.on("offscreen toggle-feature-next", async () => {
    try {
      await waitForPlayer(player);
      // Use Web API instead of SDK - works for podcasts
      player.skipToNext();
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
