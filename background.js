console.log(`I am here`);

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

function messageTab(tab) {
  browser.tabs.sendMessage(tab.id, {
    badgeText: "!",
  });
}

function onExecuted(id, result) {
  console.log(id);
  let querying = browser.tabs.get(id);
  querying.then(messageTab);
}

browser.menus.create({
  id: "mark-my-tab",
  type: "normal",
  title: "Mark My Tab",
  contexts: ["tab"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "mark-my-tab") {
    //console.log(info);
    //console.log(tab);
    var executing = browser.tabs.executeScript(tab.id, {
      file: "mark-my-tab.js",
    });

    executing.then(() => {
      onExecuted(tab.id);
    });
  }
});
