document.addEventListener('DOMContentLoaded', () => {
  // Elements for managing commands and prompt settings
  const commandList = document.getElementById('command-list');
  const newCommandInput = document.getElementById('new-command');
  const addCommandButton = document.getElementById('add-command');
  const promptTextarea = document.getElementById('prompt');
  const savePromptButton = document.getElementById('save');
  const temporaryModeToggle = document.getElementById('temporary-mode-toggle'); // New checkbox for temporary mode

  // Vérification des éléments avant d'utiliser addEventListener
  if (addCommandButton) {
    // Event listener for adding a new command
    addCommandButton.addEventListener('click', () => {
      const newCommand = newCommandInput ? newCommandInput.value.trim() : '';
      if (newCommand) {
        chrome.storage.sync.get({ commands: [] }, (result) => {
          const commands = result.commands;
          commands.push({ id: newCommand.toLowerCase(), title: newCommand });
          chrome.storage.sync.set({ commands }, () => {
            chrome.runtime.sendMessage({ updateContextMenu: true });
            loadCommands();
            if (newCommandInput) newCommandInput.value = ''; // Clear the input after adding
            console.log("Command added:", newCommand);
          });
        });
      } else {
        alert("Please enter a valid command.");
      }
    });
  }

  // Chargement du prompt personnalisé, du mode temporaire, et du mode normal
  chrome.storage.sync.get({ prompt: "Summarize the content of this page:", mode: 'temporary', temporaryMode: true }, (result) => {
    // Charger le prompt
    if (promptTextarea) {
      promptTextarea.value = result.prompt;
      console.log("Loaded prompt:", result.prompt);
    }

    // Charger le mode temporaire
    if (temporaryModeToggle) {
      temporaryModeToggle.checked = result.temporaryMode;
      console.log("Loaded temporary mode:", result.temporaryMode);
    }

    // Charger le mode actuel (temporary ou normal)
    const modeElement = document.querySelector(`input[name="mode"][value="${result.mode}"]`);
    if (modeElement) {
      modeElement.checked = true;
      console.log("Loaded mode:", result.mode);
    } else {
      console.error("Mode element not found in the DOM.");
    }
  });

  // Event listener for saving the custom prompt and temporary mode
  if (savePromptButton && promptTextarea && temporaryModeToggle) {
    savePromptButton.addEventListener('click', () => {
      const newPrompt = promptTextarea.value.trim();
      const isTemporaryMode = temporaryModeToggle.checked;

      if (newPrompt) {
        chrome.storage.sync.set({ prompt: newPrompt, temporaryMode: isTemporaryMode }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error saving settings:", chrome.runtime.lastError);
          } else {
            alert('Settings saved successfully!');
            console.log("Prompt saved:", newPrompt);
            console.log("Temporary mode saved:", isTemporaryMode);
            window.close(); // Close the options page after successful save
          }
        });
      } else {
        alert("Please enter a valid prompt before saving.");
      }
    });
  }

  // Load and display the commands
  function loadCommands() {
    chrome.storage.sync.get({ commands: [] }, (result) => {
      if (commandList) {
        commandList.innerHTML = '';
        result.commands.forEach((command, index) => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${command.title} 
            <button data-index="${index}" class="delete-btn">Delete</button>
            <button data-index="${index}" class="edit-btn">Edit</button>
          `;
          commandList.appendChild(li);
        });
      }
    });
  }

  // Event listener for deleting a command
  if (commandList) {
    commandList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const index = parseInt(e.target.dataset.index);
        chrome.storage.sync.get({ commands: [] }, (result) => {
          const commands = result.commands;
          commands.splice(index, 1); // Remove the selected command
          chrome.storage.sync.set({ commands }, () => {
            chrome.runtime.sendMessage({ updateContextMenu: true });
            loadCommands();
            console.log("Command deleted at index:", index);
          });
        });
      }

      if (e.target.classList.contains('edit-btn')) {
        const index = parseInt(e.target.dataset.index);
        chrome.storage.sync.get({ commands: [] }, (result) => {
          const commands = result.commands;
          const newTitle = prompt("Edit command title", commands[index].title);
          if (newTitle) {
            commands[index].title = newTitle;
            commands[index].id = newTitle.toLowerCase();
            chrome.storage.sync.set({ commands }, () => {
              chrome.runtime.sendMessage({ updateContextMenu: true });
              loadCommands();
              console.log("Command edited:", newTitle);
            });
          }
        });
      }
    });
  }

  // Event listener for changing mode
  document.querySelectorAll('input[name="mode"]').forEach((input) => {
    input.addEventListener('change', (e) => {
      const mode = e.target.value;
      chrome.storage.sync.set({ mode: mode }, () => {
        console.log("Mode saved successfully:", mode);
      });
    });
  });

  // Load the commands when the options page is opened
  loadCommands();
});
