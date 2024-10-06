document.addEventListener('DOMContentLoaded', () => {
  const toggleCheckbox = document.getElementById('temporary-mode-toggle');
  
  // Load the current mode
  chrome.storage.sync.get({ temporaryMode: true }, (result) => {
    toggleCheckbox.checked = result.temporaryMode;
  });

  // Save the mode when toggled
  document.getElementById('save-settings').addEventListener('click', () => {
    const temporaryMode = toggleCheckbox.checked;

    chrome.storage.sync.set({ temporaryMode }, () => {
      chrome.runtime.sendMessage({ toggleMode: true }, (response) => {
        alert(`Mode switched to: ${response.mode}`);
      });
    });
  });
});
