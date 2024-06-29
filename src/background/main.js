import utils from "../utils.coffee";
import message from "./message.coffee";

let creating = null;
const setupOffscreenDocument = async () => {
  const path = "offscreen.html";
  const offscreenUrl = chrome.runtime.getURL(path);
  const existingContexts = await chrome.runtime.getContexts({
    contextTypes: ["OFFSCREEN_DOCUMENT"],
    documentUrls: [offscreenUrl],
  });

  creating = null; // A global promise to avoid concurrency issues

  if (existingContexts.length > 0) {
    return;
  }

  if (creating) {
    await creating;
  } else {
    const spotifyWebPlaybackSDKPromise = new Promise((resolve, reject) => {
      global.spotifyWebPlaybackSDKResolver = resolve;
      setTimeout(() => {
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
  await setupOffscreenDocument();
  const state = await utils.send("get spotify current state");
  console.log("Spotify current state: ", state);
  return state;
});

message.on("spotify sdk player is ready", async () => {
  global.spotifyWebPlaybackSDKResolver();
});

global.getCurrentPlaying = () => {
  return utils.send("get spotify current playing").then(console.log);
};

global.getCurrentState = () => {
  return utils.send("get spotify current state").then(console.log);
};
