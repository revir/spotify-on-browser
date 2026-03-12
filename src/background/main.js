import utils from "../utils.coffee";
import message from "./message.coffee";

let creating = null;
let spotifyWebPlaybackSDKPromise = null;

const setupOffscreenDocument = async () => {
  if (utils.isFirefox()) {
    // Firefox does not support offscreen document
    if (global.spotifyWebPlaybackSDKResolver) {
      return await spotifyWebPlaybackSDKPromise;
    }
    spotifyWebPlaybackSDKPromise = new Promise((resolve, reject) => {
      global.spotifyWebPlaybackSDKResolver = resolve;
      setTimeout(() => {
        reject(new Error("Spotify web playback sdk is not ready"));
      }, 3000);
    });
    await spotifyWebPlaybackSDKPromise;
    return;
  }

  const path = "offscreen.html";
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl],
  });

  if (existingContexts.length > 0) {
    return;
  }

  if (creating) {
    await creating;
    await spotifyWebPlaybackSDKPromise;
  } else {
    spotifyWebPlaybackSDKPromise = new Promise((resolve, reject) => {
      global.spotifyWebPlaybackSDKResolver = resolve;
      setTimeout(() => {
        creating = null;
        spotifyWebPlaybackSDKPromise = null;
        reject(new Error("Spotify web playback sdk is not ready"));
      }, 3000);
    });
    creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play audio of spotify tracks",
    });
    await creating;
    await spotifyWebPlaybackSDKPromise;
    creating = null;
    spotifyWebPlaybackSDKPromise = null;
  }
};

setupOffscreenDocument().catch(console.error);

chrome.commands.onCommand.addListener(async function (command) {
  await setupOffscreenDocument().catch(console.error);
  utils.send("offscreen " + command);
});

message.on("open options shortcuts", () => {
  chrome.tabs.create({
    url: "chrome://extensions/shortcuts",
  });
});
message.on("open options", () => {
  chrome.runtime.openOptionsPage();
});

message.on("track saved", ({ trackId, trackName }) => {
  chrome.notifications.create(`notification-${trackId}`, {
    message: `Great, "${trackName}" has been saved in your liked songs.`,
    iconUrl: "images/256.png",
    title: `Spotify on ${utils.getBrowserName()}`,
    type: "basic",
  });
});

message.on("spotify current state", async () => {
  await setupOffscreenDocument().catch(console.error);
  if (!utils.isFirefox()) {
    const state = await utils.send("get spotify current state");
    // console.log("Spotify current state: ", state);
    return state;
  }
});

// Ensure offscreen document exists before forwarding player-related messages
message.on("spotify action", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen spotify action", data);
});

message.on("checkUserSavedTrack", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen checkUserSavedTrack", data);
});

message.on("saveUserTrack", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen saveUserTrack", data);
});

message.on("removeUserSavedTrack", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen removeUserSavedTrack", data);
});

message.on("getPlaylists", async () => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen getPlaylists");
});

message.on("getSavedShows", async () => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen getSavedShows");
});

message.on("getSavedAlbums", async () => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen getSavedAlbums");
});

message.on("getSavedAudiobooks", async () => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen getSavedAudiobooks");
});

message.on("getFeaturedPlaylists", async () => {
  await setupOffscreenDocument().catch(console.error);
  return utils.send("offscreen getFeaturedPlaylists");
});

message.on("spotify sdk player is ready", async () => {
  // console.log("spotify sdk player is ready");
  global.spotifyWebPlaybackSDKResolver();
});

global.getCurrentPlaying = () => {
  return utils.send("get spotify current playing").then(console.log);
};

global.getCurrentState = () => {
  return utils.send("get spotify current state").then(console.log);
};
