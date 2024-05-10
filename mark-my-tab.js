function setIcon(iconDataUrl) {
    console.log("setIcon");
    console.log(iconDataUrl);
    
    let faviconEl = document.querySelector("link[rel*=icon]");
    if (!faviconEl){
      console.log("No favicon element found. Creating one now.");
      faviconEl = document.createElement('link');
      faviconEl.rel = 'icon';
      faviconEl.href = '';
      document.getElementsByTagName('head')[0].appendChild(faviconEl);
    } 
    
    faviconEl.setAttribute("href", iconDataUrl);
}

function markMyPageReceiver(request, sender, sendResponse) {
//    myBadger.value = request.badgeText;
    console.log(request.iconDataUrl);
    setIcon(request.iconDataUrl);
}

// var myBadgerOptions = {};
// var myBadger = myBadger? myBadger : new Badger(myBadgerOptions);
browser.runtime.onMessage.removeListener(markMyPageReceiver);
browser.runtime.onMessage.addListener(markMyPageReceiver);


