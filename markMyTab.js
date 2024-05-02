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
  
requestPermissions().then();

browser.menus.create({
    id: "icon-selection",
    type:"normal",
    title: "Mark My Tab:",
    contexts: ['tab']
  });
//Tab.favIconUrl

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "icon-selection") {
      console.log(info.selectionText);
    }
  });