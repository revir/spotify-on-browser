// Detect browser
const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
const isChrome =
  navigator.userAgent.toLowerCase().includes("chrome") &&
  !navigator.userAgent.toLowerCase().includes("edg");

// Show Firefox banner if needed
if (isFirefox) {
  const banner = document.getElementById("firefox-banner");
  const dismissed = localStorage.getItem("firefox-banner-dismissed");
  if (!dismissed) {
    banner.classList.add("show");
  }
}

// Show Chrome notice
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
