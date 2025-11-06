function setIcon(iconDataUrl) {
  // Remove all existing <link rel="icon"> elements
  document.querySelectorAll("link[rel='icon']").forEach((el) => el.remove());

  // Create a new <link rel="icon"> element
  let faviconEl = document.createElement("link");
  faviconEl.rel = "icon";
  faviconEl.href = iconDataUrl;

  // Append the new favicon to the <head>
  document.head.appendChild(faviconEl);
}

function markMyPageReceiver(request, sender, sendResponse) {
  setIcon(request.iconDataUrl);
}

browser.runtime.onMessage.removeListener(markMyPageReceiver);
browser.runtime.onMessage.addListener(markMyPageReceiver);
