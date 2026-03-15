import utils from "../utils.coffee";
import message from "./message.coffee";

let creating = null;
let spotifyWebPlaybackSDKPromise = null;

// Helper for sending messages to offscreen/controller
// On Firefox, uses direct call since background can't message itself
const sendToOffscreen = (type, data = {}) => {
  if (utils.isFirefox()) {
    return message.call(type, data);
  }
  return utils.send(type, data);
};

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
  sendToOffscreen("offscreen " + command);
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
  const state = await sendToOffscreen("get spotify current state");
  // console.log("Spotify current state: ", state);
  return state;
});

// Ensure offscreen document exists before forwarding player-related messages
message.on("spotify action", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen spotify action", data);
});

message.on("checkUserSavedTrack", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen checkUserSavedTrack", data);
});

message.on("saveUserTrack", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen saveUserTrack", data);
});

message.on("removeUserSavedTrack", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen removeUserSavedTrack", data);
});

// Episode (podcast) handlers
message.on("checkUserSavedEpisode", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen checkUserSavedEpisode", data);
});

message.on("saveUserEpisode", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen saveUserEpisode", data);
});

message.on("removeUserSavedEpisode", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen removeUserSavedEpisode", data);
});

message.on("getPlaylists", async () => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen getPlaylists");
});

message.on("getSavedShows", async () => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen getSavedShows");
});

message.on("getSavedAlbums", async () => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen getSavedAlbums");
});

message.on("getFeaturedPlaylists", async () => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen getFeaturedPlaylists");
});

message.on("getQueue", async () => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen getQueue");
});

message.on("setShuffle", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen setShuffle", data);
});

message.on("setRepeatMode", async (data) => {
  await setupOffscreenDocument().catch(console.error);
  return sendToOffscreen("offscreen setRepeatMode", data);
});

message.on("spotify sdk player is ready", async () => {
  // console.log("spotify sdk player is ready");
  global.spotifyWebPlaybackSDKResolver();
});

global.getCurrentPlaying = () => {
  return sendToOffscreen("get spotify current playing").then(console.log);
};

global.getCurrentState = () => {
  return sendToOffscreen("get spotify current state").then(console.log);
};

chrome.runtime.onInstalled.addListener(async function (details) {
  if ([chrome.runtime.OnInstalledReason.INSTALL].includes(details.reason)) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("option.html?welcome"),
    });
  } else if (
    [chrome.runtime.OnInstalledReason.UPDATE].includes(details.reason)
  ) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("option.html?updated"),
    });
  }
});

chrome.runtime.setUninstallURL("https://forms.gle/bPg63ANFGppokW5w8");
