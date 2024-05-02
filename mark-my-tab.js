function markMyPageReceiver(request, sender, sendResponse) {
    document.body.textContent = "";
    let header = document.createElement("h1");
    header.textContent = request.replacement;
    document.body.appendChild(header);
  }
  browser.runtime.onMessage.addListener(markMyPageReceiver);
  