function markMyPageReceiver(request, sender, sendResponse) {
    document.body.textContent = "";
    console.log("a: " + document.querySelector("link[rel$=icon]"));
    document.title = request.newTitle
  }

  browser.runtime.onMessage.addListener(markMyPageReceiver);
  