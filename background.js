// Default prompt to summarize URL
const defaultPrompt = "Summarize the content of this page:";

// Create context menu for text selection
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "chatgpt-context",
    title: "Summarize with ChatGPT",
    contexts: ["selection"]
  });
});

// Handle clicks on the context menu for selected text
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "chatgpt-context" && info.selectionText) {
    chrome.storage.sync.get({ prompt: defaultPrompt }, (result) => {
      const prompt = result.prompt;
      const encodedText = encodeURIComponent(info.selectionText);
      const url = `https://chatgpt.com/?model=gpt-4o&q=${prompt} ${encodedText}&temporary-chat=true`;

      chrome.windows.create({
        url: url,
        type: "popup",
        width: 500,
        height: 700
      });
    });
  }
});

// Handle clicks on the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.sync.get({ prompt: defaultPrompt }, (result) => {
    const prompt = result.prompt;
    const encodedUrl = encodeURIComponent(tab.url);
    const url = `https://chatgpt.com/?model=gpt-4o&q=${prompt} ${encodedUrl}&temporary-chat=true`;

    chrome.windows.create({
      url: url,
      type: "popup",
      width: 500,
      height: 700
    });
  });
});