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
    global.creating = chrome.offscreen.createDocument({
      url: path,
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play audio of spotify tracks",
    });
    await global.creating;
    global.creating = null;
  }
};

setupOffscreenDocument();

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
