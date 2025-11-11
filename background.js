// https://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
//

const permissionsToRequest = {
  permissions: ["tabs"],
  origins: ["<all_urls>"],
};

const FAVICON_ORIG_ID = "mark-my-tab-favicon-orig";

// Store original favicons per tab
const originalFavicons = new Map();

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

// Color definitions map
const colorDefinitions = new Map([
  ["#f31457ff", ["#fff", "Red"]],
  ["#ffcb3bff", ["#000", "Yellow"]],
  ["#75d137ff", ["#000", "Green"]],
  ["#0097e6ed", ["#fff", "Blue"]],
  ["#9c88ff", ["#fff", "Purple"]],
  ["#f5f6fa", ["#000", "White"]],
  ["#2f3640", ["#fff", "Granite"]],
]);

// Function to create a colored icon data URL
function createColorIcon(bgColor, fgColor, size = 16) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size; 
  const ctx = canvas.getContext("2d");

  const radius = size * 0.2; // 20% of size for rounded corners
  const x = 1;
  const y = 1;
  const width = size - 2;
  const height = size - 2;

  // Draw rounded rectangle
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  // Add border
  ctx.strokeStyle = "#777";
  ctx.lineWidth = 1;
  ctx.stroke();

 // Draw check mark
  ctx.strokeStyle = fgColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.fillStyle = fgColor;
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.5, width * 0.10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  return canvas.toDataURL();
}

// Create main menu item
browser.menus.create({
  id: "mark-my-tab",
  type: "normal",
  title: "Mark My Tab",
  contexts: ["tab"],
  icons: null,
});

// Create color menu items using loop
for (const [colorCode, colorPair] of colorDefinitions) {
  browser.menus.create({
    id: `mark-my-tab-${colorCode}`,
    parentId: "mark-my-tab",
    type: "normal",
    title: colorPair[1],
    contexts: ["tab"],
    icons: {
      16: createColorIcon(colorCode, colorPair[0], 16),
      32: createColorIcon(colorCode, colorPair[0], 32),
    },
  });
}

// Create separator
browser.menus.create({
  id: "mark-my-tab-separator",
  parentId: "mark-my-tab",
  type: "separator",
  contexts: ["tab"],
});

// Create "None" option
browser.menus.create({
  id: "mark-my-tab-none",
  parentId: "mark-my-tab",
  type: "normal",
  title: "None",
  contexts: ["tab"],
});

function messageTab(tab, bgColor, fgColor) {
  // Get the original favicon URL from our storage
  const originalFaviconUrl = originalFavicons.get(tab.id) || tab.favIconUrl;

  if (bgColor === "none") {
    // Restore original favicon
    browser.tabs.sendMessage(tab.id, { iconDataUrl: originalFaviconUrl });
  } else {
    // Create badge with color
    var myBadgerOptions = {
      src: originalFaviconUrl,
      backgroundColor: bgColor,
      color: fgColor,
    };
    let badger = new Badger(myBadgerOptions);

    badger.update((dataURL) => {
      browser.tabs.sendMessage(tab.id, {
        iconDataUrl: dataURL,
      });
    });
  }
}

function onExecuted(id, bgColor, fgColor) {
  console.log("onExecuted color:", bgColor);
  let querying = browser.tabs.get(id);
  querying.then((tab) => messageTab(tab, bgColor, fgColor));
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("mark-my-tab-")) {
    let bgColor = info.menuItemId.split("mark-my-tab-")[1];
    let fgColor = colorDefinitions.get(bgColor)[0];

    // Store original favicon URL if not already stored
    if (!originalFavicons.has(tab.id)) {
      console.log("Storing original favicon:", tab.favIconUrl);
      originalFavicons.set(tab.id, tab.favIconUrl);
    }

    // flag the tab to be marked
    tab.isMarked = true;

    console.log("tab id: " + tab.id);
    var executing = browser.tabs.executeScript(tab.id, {
      file: "mark-my-tab.js",
    });

    executing.then(() => {
      onExecuted(tab.id, bgColor, fgColor);
    });
  }
});
