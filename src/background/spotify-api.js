export default (player) => {
  let trackSavedCache = {};
  player.on("ready", async () => {
    trackSavedCache = {};
  });

  async function request(uri, data, type = "GET") {
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
              response,
            );
            return { error: err, status: response.status };
          });
      })
      .catch((err) => {
        console.error("Spotify api request failed: ", err, type, uri, body);
        return { error: err };
      });
  }

  const webApis = {
    async refreshToken() {
      const uri = "https://accounts.spotify.com/api/token";
      return fetch(uri, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: localStorage.getItem("spotify_refresh_token"),
          client_id: localStorage.getItem("spotify_client_id"),
        }),
      })
        .then((response) => response.json())
        .then(({ refresh_token, access_token }) => {
          localStorage.setItem("spotify_refresh_token", refresh_token);
          localStorage.setItem("spotify_access_token", access_token);
          localStorage.setItem(
            "spotify_access_token_start_at",
            new Date().toISOString(),
          );
          console.log("Spotify access token refreshed: ", access_token);
          return access_token;
        })
        .catch((err) => {
          console.error("spotify refresh token failed: ", err);
          localStorage.removeItem("spotify_refresh_token");
          localStorage.removeItem("spotify_access_token");
          throw err;
        });
    },
    switchToThisPlayer() {
      const url = "https://api.spotify.com/v1/me/player";
      return request(
        url,
        {
          device_ids: [player.deviceId],
          play: true,
        },
        "PUT",
      );
    },

    getCurrentPlaying() {
      const uri = "https://api.spotify.com/v1/me/player/currently-playing";
      return request(uri).then((res) => {
        if (res) {
          if (res.error) {
            console.error(
              "Spotify get current playing track failed: ",
              res.error,
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
    },
    populateArtistInfo(track) {
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
    },

    checkUserSavedTrack(trackId) {
      if (trackSavedCache[trackId] !== undefined) {
        return trackSavedCache[trackId];
      }

      // console.log("check saved: ", trackId, trackSavedCache);

      trackSavedCache[trackId] = request(
        "https://api.spotify.com/v1/me/tracks/contains?ids=" + trackId,
      ).then((res) => {
        const r = res[0];

        trackSavedCache[trackId] = r;

        // remove after 10 minutes
        setTimeout(
          () => {
            trackSavedCache[trackId] = undefined;
          },
          10 * 60 * 1000,
        );

        return r;
      });
      return trackSavedCache[trackId];
    },
    saveUserTrack(trackId) {
      return request(
        "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
        null,
        "PUT",
      ).then((res) => {
        if (trackSavedCache[trackId] !== undefined)
          trackSavedCache[trackId] = true;

        // console.log("saved: ", trackId, trackSavedCache);
        return res;
      });
    },
    removeUserSavedTrack(trackId) {
      return request(
        "https://api.spotify.com/v1/me/tracks?ids=" + trackId,
        null,
        "DELETE",
      ).then((res) => {
        if (trackSavedCache[trackId] !== undefined)
          trackSavedCache[trackId] = false;

        // console.log("remove saved: ", trackId, trackSavedCache);
        return res;
      });
    },

    getPlaylists(limit = 20) {
      const uri = `https://api.spotify.com/v1/me/playlists?limit=${limit}`;
      return request(uri).then((res) => {
        if (res?.error) {
          console.error("Spotify get playlists failed: ", res.error);
          return { items: [] };
        }
        return res;
      });
    },

    playContext(contextUri) {
      const url = "https://api.spotify.com/v1/me/player/play";
      return request(
        url,
        {
          context_uri: contextUri,
          device_id: player.deviceId,
        },
        "PUT",
      );
    },

    getSavedShows(limit = 20) {
      const uri = `https://api.spotify.com/v1/me/shows?limit=${limit}`;
      return request(uri).then((res) => {
        if (res?.error) {
          console.error("Spotify get saved shows failed: ", res.error);
          return { items: [] };
        }
        return res;
      });
    },

    getSavedAlbums(limit = 20) {
      const uri = `https://api.spotify.com/v1/me/albums?limit=${limit}`;
      return request(uri).then((res) => {
        if (res?.error) {
          console.error("Spotify get saved albums failed: ", res.error);
          return { items: [] };
        }
        return res;
      });
    },

    getSavedAudiobooks(limit = 20) {
      const uri = `https://api.spotify.com/v1/me/audiobooks?limit=${limit}`;
      return request(uri).then((res) => {
        if (res?.error) {
          console.error("Spotify get saved audiobooks failed: ", res.error);
          return { items: [] };
        }
        return res;
      });
    },

    getFeaturedPlaylists(limit = 10) {
      const uri = `https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}`;
      return request(uri).then((res) => {
        if (res?.error) {
          console.error("Spotify get featured playlists failed: ", res.error);
          return { playlists: { items: [] } };
        }
        return res;
      });
    },

    playUri(uri) {
      const url = "https://api.spotify.com/v1/me/player/play";
      return request(
        url,
        {
          uris: [uri],
          device_id: player.deviceId,
        },
        "PUT",
      );
    },
  };

  for (const key in webApis) {
    if (typeof webApis[key] === "function") {
      player[key] = webApis[key];
    }
  }

  return webApis;
};
