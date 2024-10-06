const defaultCommands = [
  { id: "explain", title: "Explain" },
  { id: "summarize", title: "Summarize" },
  { id: "define", title: "Define" }
];

const defaultMode = "temporary";  // Default mode

// Load commands from storage or use defaults
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ commands: defaultCommands, mode: defaultMode }, (result) => {
    createContextMenu(result.commands);
  });
});

function createContextMenu(commands) {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "chatgpt-search",
      title: "Search with ChatGPT",
      contexts: ["selection"]
    });

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

// Handle clicks on the context menu or extension icon
chrome.contextMenus.onClicked.addListener((info) => {
  performSearch(info.selectionText, info.menuItemId);
});

// Listen for extension icon click to show the same options
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: showContextMenu
  });
});

function showContextMenu() {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    chrome.runtime.sendMessage({ type: "performSearch", selectedText: selectedText });
  } else {
    alert("Please select some text to search.");
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "performSearch") {
    performSearch(message.selectedText);
  }
});

function performSearch(selectedText, command) {
  chrome.storage.sync.get({ mode: defaultMode }, (result) => {
    const searchMode = result.mode;
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
