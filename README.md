# ChatGPT Context Search Extension

This Chrome/Firefox/Edge/Brave extension allows users to select text and search it on ChatGPT using custom commands like "explain," "summarize," or "define." It provides two modes (Normal and Temporary) and can handle websites that override the default right-click menu by using the extension icon.

## Features

* Customizable context menu with commands.
* Two modes of operation:
  * **Normal Mode:** Simple search
  * **Temporary Mode (default):** Search in Chat GPT temporary mode
* Extension icon for websites that override the default right-click menu.
* Works on Chrome, Firefox, Edge, Brave, and other Chromium-based browsers.

---

## Installation

### Google Chrome, Brave, and Other Chromium-Based Browsers

1. [Download the source code](https://github.com/BhashkarGupta/ChatGPT-Context-Search/archive/refs/heads/main.zip) or clone the repository by:
   `git clone https://github.com/BhashkarGupta/ChatGPT-Context-Search.git`
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top-right corner.
4. Click on **Load unpacked** and select the directory where you cloned/unziped the repository.
5. The extension should now be installed and available in the toolbar.

### Microsoft Edge

1. [Download the source code](https://github.com/BhashkarGupta/ChatGPT-Context-Search/archive/refs/heads/main.zip) or clone the repository by:
   `git clone https://github.com/BhashkarGupta/ChatGPT-Context-Search.git`
2. Open Edge and navigate to `edge://extensions/`.
3. Enable **Developer mode** by toggling the switch in the bottom-left corner.
4. Click on **Load unpacked** and select the directory where you cloned the repository.
5. The extension should now be installed and available in the toolbar.

### Mozilla Firefox

1. [Download the source code](https://github.com/BhashkarGupta/ChatGPT-Context-Search/archive/refs/heads/main.zip) or clone the repository by:
   `git clone https://github.com/BhashkarGupta/ChatGPT-Context-Search.git`
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click on **Load Temporary Add-on** and select any file from the repository (e.g., `manifest.json`).
4. The extension will be loaded temporarily and will need to be reloaded every time Firefox is restarted.

## Usage

1. **Right-click** on any selected text in your browser.
2. **Select the ChatGPT Context Search** sub-menu from the context menu.
3. Choose from one of the available options (e.g., "Explain," "Summarize," "Define"). This will open a new window with the search performed on ChatGPT.
4. **Temporary Mode** (default): This mode appends `&temporary-chat=true` to the URL, which is useful for temporary sessions.
5. **Normal Mode** : Switch to this mode from the extension’s options page to perform normal searches and hence you can see that in your chat gpt history.

---

## Customization

### Add, Edit, or Remove Commands

1. Click on the extension icon and open the options page.
2. From the options page, you can:
   * **Add** new commands to the context menu.
   * **Edit** existing commands.
   * **Delete** commands you no longer need.
3. The context menu will be updated accordingly after saving changes.

### Switch Between Temporary and Normal Mode

* Navigate to the extension's **Options Page** (from the extension icon).
* Select either **Normal Mode** or  **Temporary Mode** . The extension will use the selected mode for all future searches.

---
