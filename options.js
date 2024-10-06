document.addEventListener('DOMContentLoaded', () => {
  const commandList = document.getElementById('command-list');
  const newCommandInput = document.getElementById('new-command');
  const addCommandButton = document.getElementById('add-command');

  // Load current mode
  chrome.storage.sync.get({ mode: 'temporary' }, (result) => {
    document.querySelector(`input[name="mode"][value="${result.mode}"]`).checked = true;
  });

  // Load and display the commands
  function loadCommands() {
    chrome.storage.sync.get({ commands: [] }, (result) => {
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
    });
  }

  // Event listener for adding a new command
  addCommandButton.addEventListener('click', () => {
    const newCommand = newCommandInput.value.trim();
    if (newCommand) {
      chrome.storage.sync.get({ commands: [] }, (result) => {
        const commands = result.commands;
        commands.push({ id: newCommand.toLowerCase(), title: newCommand });
        chrome.storage.sync.set({ commands }, () => {
          chrome.runtime.sendMessage({ updateContextMenu: true });
          loadCommands();
        });
      });
    }
  });

  // Event listener for deleting a command
  commandList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const index = parseInt(e.target.dataset.index);
      chrome.storage.sync.get({ commands: [] }, (result) => {
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
      chrome.storage.sync.get({ commands: [] }, (result) => {
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

  // Event listener for changing mode
  document.querySelectorAll('input[name="mode"]').forEach((input) => {
    input.addEventListener('change', (e) => {
      const mode = e.target.value;
      chrome.storage.sync.set({ mode: mode });
    });
  });

  // Load the commands when the options page is opened
  loadCommands();
});
