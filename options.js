document.addEventListener('DOMContentLoaded', () => {
  const commandList = document.getElementById('command-list');
  const newCommandInput = document.getElementById('new-command');
  const addCommandButton = document.getElementById('add-command');
  const promptTextarea = document.getElementById('prompt');
  const savePromptButton = document.getElementById('save');
  const toggleCheckbox = document.getElementById('temporary-mode-toggle');

  const defaultCommands = [
      { id: "explain", title: "Explain" },
      { id: "summarize", title: "Summarize" },
      { id: "define", title: "Define" }
  ];

  // Initialiser Sortable.js pour rendre la liste des commandes réorganisable
  if (commandList) {
      Sortable.create(commandList, {
          animation: 150,
          onEnd: function () {
              saveCommandOrder();
          }
      });
  }

  function saveCommandOrder() {
      const items = commandList.children;
      let newCommands = [];
      
      for (let item of items) {
          const title = item.querySelector('.command-title').textContent.trim();
          if (title) {
              newCommands.push({ id: title.toLowerCase(), title: title });
          }
      }

      chrome.storage.sync.set({ commands: newCommands }, () => {
          chrome.runtime.sendMessage({ updateContextMenu: true });
          console.log("Command order saved");
      });
  }

  // Event listener for adding a new command
  addCommandButton.addEventListener('click', () => {
      const newCommand = newCommandInput.value.trim();
      if (newCommand) {
          chrome.storage.sync.get({ commands: defaultCommands }, (result) => {
              const commands = result.commands;
              commands.push({ id: newCommand.toLowerCase(), title: newCommand });
              chrome.storage.sync.set({ commands }, () => {
                  chrome.runtime.sendMessage({ updateContextMenu: true });
                  loadCommands();
                  newCommandInput.value = ''; // Clear the input after adding
              });
          });
      } else {
          alert("Please enter a valid command.");
      }
  });

  // Load commands when the options page is opened
  function loadCommands() {
      chrome.storage.sync.get({ commands: defaultCommands }, (result) => {
          commandList.innerHTML = '';
          result.commands.forEach((command, index) => {
              const li = document.createElement('li');
              li.className = 'command-item';
              li.innerHTML = `
                  <span class="command-title">${command.title}</span>
                  <button data-index="${index}" class="edit-btn">Edit</button>
                  <button data-index="${index}" class="delete-btn">Delete</button>
              `;
              commandList.appendChild(li);
          });
      });
  }

  // Event listener for deleting a command
  commandList.addEventListener('click', (e) => {
      if (e.target.classList.contains('delete-btn')) {
          const index = parseInt(e.target.dataset.index);
          chrome.storage.sync.get({ commands: defaultCommands }, (result) => {
              const commands = result.commands;
              commands.splice(index, 1); // Remove the selected command
              chrome.storage.sync.set({ commands }, () => {
                  chrome.runtime.sendMessage({ updateContextMenu: true });
                  loadCommands();
              });
          });
      }
  });

  // Event listener for editing a command
  commandList.addEventListener('click', (e) => {
      if (e.target.classList.contains('edit-btn')) {
          const index = parseInt(e.target.dataset.index);
          chrome.storage.sync.get({ commands: defaultCommands }, (result) => {
              const commands = result.commands;
              const newTitle = prompt("Edit command title", commands[index].title);
              if (newTitle) {
                  commands[index].title = newTitle;
                  commands[index].id = newTitle.toLowerCase();
                  chrome.storage.sync.set({ commands }, () => {
                      chrome.runtime.sendMessage({ updateContextMenu: true });
                      loadCommands();
                  });
              }
          });
      }
  });

  // Load the prompt and mode
  chrome.storage.sync.get({ prompt: "Summarize the content of this page:", temporaryMode: true }, (result) => {
      promptTextarea.value = result.prompt;
      toggleCheckbox.checked = result.temporaryMode;
  });

  // Save the prompt and mode
  savePromptButton.addEventListener('click', () => {
      const newPrompt = promptTextarea.value.trim();
      const temporaryMode = toggleCheckbox.checked;
      chrome.storage.sync.set({ prompt: newPrompt, temporaryMode: temporaryMode }, () => {
          alert("Settings saved successfully!");
          window.close(); // Close the options page after successful save
      });
  });

  // Load commands initially
  loadCommands();
});
