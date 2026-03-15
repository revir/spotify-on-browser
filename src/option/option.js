import "./option.less";

// Detect browser
const isFirefox =
  navigator.userAgent.toLowerCase().includes("firefox") ||
  location.href.includes("firefox=1");
const isChrome =
  navigator.userAgent.toLowerCase().includes("chrome") &&
  !navigator.userAgent.toLowerCase().includes("edg");
const isUpdated = location.search.includes("updated");
const needAutoPlay = location.search.includes("needAutoPlay");
// Show update dialog if ?updated param is present
if (isUpdated) {
  const dialog = document.createElement("div");
  dialog.className = "update-dialog-overlay";
  dialog.innerHTML = `
    <div class="update-dialog">
      <h2>Welcome to v3.0!</h2>
      <p>Thanks for updating! This is a big milestone with lots of new features: larger player, seekbar, smart playback mode, queue panel, library, and full podcast support.</p>
      <p><a href="https://pnl.dev/topic/1082/spotify-on-browser-v3-0-a-big-bright-new-player" target="_blank" class="btn-blog">
        🚀 Spotify on Browser v3.0: A Big, Bright New Player!
        &nbsp;<i class="fa fa-external-link"></i>
      </a></p>
      <div class="update-dialog-buttons">
        <button class="btn-secondary" id="close-update-dialog">Got it!</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);

  document
    .getElementById("close-update-dialog")
    .addEventListener("click", () => {
      dialog.remove();
      // Clean up the URL
      history.replaceState(null, "", location.pathname);
    });
}

// Show Firefox banner if needed
if (isFirefox && (!isUpdated || needAutoPlay)) {
  const banner = document.getElementById("firefox-banner");
  const dismissed = localStorage.getItem("firefox-banner-dismissed");
  // Always show if needAutoPlay is set, even if previously dismissed
  if (!dismissed || needAutoPlay) {
    banner.classList.add("show");

    // Create a Vimeo iframe to trigger autoplay permission in Firefox
    // Hidden but unmuted - Firefox will block it and show permission icon in address bar
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://player.vimeo.com/video/218724174?autoplay=1&muted=0&background=1";
    iframe.style.cssText =
      "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;";
    iframe.allow = "autoplay; fullscreen";
    document.body.appendChild(iframe);
  }
}

if (isChrome) {
  const chromeDismissed = localStorage.getItem("chrome-banner-dismissed");
  if (!chromeDismissed) {
    document.getElementById("chrome-action-banner").classList.add("show");
  }
}

// Setup shortcuts buttons (both banner and bottom button)
const setupBtns = [
  document.getElementById("setup-shortcuts-btn"),
  document.getElementById("setup-shortcuts-btn-banner"),
].filter(Boolean);

setupBtns.forEach((btn) => {
  if (isFirefox) {
    btn.href =
      "https://support.mozilla.org/en-US/kb/manage-extension-shortcuts-firefox";
    btn.target = "_blank";
  } else {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (chrome && chrome.runtime) {
        chrome.runtime.sendMessage({ type: "open options shortcuts" });
      }
    });
  }
});

// Dismiss Firefox banner
const firefoxDismissBtn = document.getElementById("firefox-dismiss-btn");
if (firefoxDismissBtn) {
  firefoxDismissBtn.addEventListener("click", () => {
    document.getElementById("firefox-banner").classList.remove("show");
    localStorage.setItem("firefox-banner-dismissed", "true");
  });
}

// Dismiss Chrome action banner
const chromeDismissBtn = document.getElementById("chrome-dismiss-btn");
if (chromeDismissBtn) {
  chromeDismissBtn.addEventListener("click", () => {
    document.getElementById("chrome-action-banner").classList.remove("show");
    localStorage.setItem("chrome-banner-dismissed", "true");
  });
}
