function markMyPageReceiver(request, sender, sendResponse) {
    myBadger.value = "!";
}

var myBadgerOptions = {};
var myBadger = myBadger? myBadger : new Badger(myBadgerOptions);
browser.runtime.onMessage.removeListener(markMyPageReceiver);
browser.runtime.onMessage.addListener(markMyPageReceiver);


