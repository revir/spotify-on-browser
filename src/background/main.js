import utils from "../utils.coffee";
import message from "./message.coffee";

const setupOffscreenDocument = async () => {
  const path = "offscreen.html";
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl],
  });

  global.creating = null; // A global promise to avoid concurrency issues

  if (existingContexts.length > 0) {
    return;
  }

  if (global.creating) {
    await global.creating;
  } else {
    const spotifyWebPlaybackSDKPromise = new Promise((resolve, reject) => {
      global.spotifyWebPlaybackSDKResolver = resolve;
      setTimeout(() => {
        reject(new Error("Spotify web playback sdk is not ready"));
      }, 3000);
    });
    global.spotifyWebPlaybackSDKPromise = spotifyWebPlaybackSDKPromise;
    global.creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play audio of spotify tracks",
    });
    await global.creating;
    await spotifyWebPlaybackSDKPromise;
    global.creating = null;
  }
};

setupOffscreenDocument().catch(console.error);

chrome.commands.onCommand.addListener(function (command) {
  utils.send(command);
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
    title: "Spotify on Browser",
    type: "basic",
  });
});

message.on("spotify current state", async () => {
  await global.spotifyWebPlaybackSDKPromise;
  const state = await utils.send("get spotify current state");
  //   console.log("Spotify current state: ", state);
  return state;
});

message.on("spotify sdk player is ready", async () => {
  global.spotifyWebPlaybackSDKResolver();
});
