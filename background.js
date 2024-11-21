const defaultCommands = [
  { id: "explain", title: "Explain" },
  { id: "summarize", title: "Summarize" },
  { id: "define", title: "Define" }
];

const defaultMode = "temporary";  // Default mode

// Load commands from storage or use defaults on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ commands: defaultCommands, mode: defaultMode }, (result) => {
    createContextMenu(result.commands);
  });
});

function createContextMenu(commands) {
  // Remove any existing context menus
  chrome.contextMenus.removeAll(() => {
    // Create the main parent context menu
    chrome.contextMenus.create({
      id: "chatgpt-search",
      title: "Search with ChatGPT",
      contexts: ["selection"]
    });

    // Create child context menus for each command
    commands.forEach(command => {
      chrome.contextMenus.create({
        id: command.id,
        parentId: "chatgpt-search",
        title: command.title,
        contexts: ["selection"]
      });
    });
  });
}

// Handle clicks on the context menu for selected text
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId && info.selectionText) {
    performSearch(info.selectionText, info.menuItemId);
  }
});

// Handle clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  if (tab.url) {
    chrome.storage.sync.get({ prompt: "Summarize the content of this page:", temporaryMode: true }, (result) => {
      const prompt = result.prompt;
      const encodedUrl = encodeURIComponent(tab.url);
      let url;

      // Déterminer si le résumé doit être temporaire ou non
      if (result.temporaryMode) {
        url = `https://chatgpt.com/?model=gpt-4o&q=${prompt} ${encodedUrl}&temporary-chat=true`;
      } else {
        url = `https://chatgpt.com/?model=gpt-4o&q=${prompt} ${encodedUrl}`;
      }

      // Ouvrir un nouvel onglet avec l'URL au lieu d'une fenêtre popup
      chrome.tabs.create({
        url: url,
        active: true
      }, (newTab) => {
        if (chrome.runtime.lastError) {
          console.error("Error creating new tab: ", chrome.runtime.lastError);
        }
      });
    });
  } else {
    console.error("No URL found for the current tab");
  }
});


function performSearch(selectedText, command) {
  chrome.storage.sync.get({ mode: defaultMode, temporaryMode: true }, (result) => {
    const searchMode = result.temporaryMode ? 'temporary' : 'normal';
    const encodedText = encodeURIComponent(selectedText);
    let url;

    if (searchMode === "temporary") {
      url = `https://chatgpt.com/?model=gpt-4o&q=${command} ${encodedText}&temporary-chat=true`;
    } else {
      url = `https://chatgpt.com/?model=gpt-4o&q=${command} ${encodedText}`;
    }

    chrome.windows.create({
      url: url,
      type: "popup",
      width: 500,
      height: 700
    }, (newWindow) => {
      if (chrome.runtime.lastError) {
        console.error("Error creating new window: ", chrome.runtime.lastError);
      }
    });
  });
}

// Listen for message to update the context menu
chrome.runtime.onMessage.addListener((message) => {
  if (message.updateContextMenu) {
    chrome.storage.sync.get({ commands: [] }, (result) => {
      createContextMenu(result.commands);
    });
  }
});
