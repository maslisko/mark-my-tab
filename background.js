// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
//

const permissionsToRequest = {
  permissions: ["tabs"],
  origins: ["<all_urls>"],
};

async function requestPermissions() {
  function onResponse(response) {
    if (response) {
      console.log("Permission was granted");
    } else {
      console.log("Permission was refused");
    }
    return browser.permissions.getAll();
  }

  const response = await browser.permissions.request(permissionsToRequest);
  const currentPermissions = await onResponse(response);

  console.log(`Current permissions:`, currentPermissions);
}

browser.menus.create({
  id: "mark-my-tab",
  type: "normal",
  title: "Mark My Tab",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-red",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Red",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#00FF00",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Green",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#0000FF",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Blue",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#FFFF00",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Yellow",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#FF00FF",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Magenta",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#00FFFF",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Cyan",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#FFA500",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Orange",
  contexts: ["tab"],
});

browser.menus.create({
  id: "mark-my-tab-#800080",
  parentId: "mark-my-tab",
  type: "normal",
  title: "Purple",
  contexts: ["tab"],
});

function messageTab(tab, color) {
  var myBadgerOptions = { src: tab.favIconUrl, backgroundColor: color };

  let badger = new Badger(myBadgerOptions);
  badger.update((dataURL) => {
    iconDataUrl = badger.dataURL;

    browser.tabs.sendMessage(tab.id, {
      iconDataUrl: dataURL,
    });
  });
}

function onExecuted(id, color) {
//function onExecuted(id) {
  console.log("onExecuted color:", color);
  let querying = browser.tabs.get(id);
  querying.then((tab) => messageTab(tab, color));
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  let color = info.menuItemId.split("mark-my-tab-")[1];
  if (info.menuItemId.startsWith("mark-my-tab")) {
  //if (info.menuItemId === "mark-my-tab") {
    console.log("Marking tab with color:", color);

    // store the original icon
    tab.favIconUrlOrig = tab.favIconUrl;
    // flag the tab to be marked
    tab.isMarked = true;

    console.log("tab id: " + tab.id);
    var executing = browser.tabs.executeScript(tab.id, {
      file: "mark-my-tab.js",
    });

    executing.then(() => {
      onExecuted(tab.id, color);
      //onExecuted(tab.id);
    });
  }
});
