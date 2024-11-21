<script>
    document.addEventListener('DOMContentLoaded', () => {
        const commandList = document.getElementById('command-list');

        // Initialiser Sortable.js pour rendre la liste réorganisable
        if (commandList) {
            Sortable.create(commandList, {
                animation: 150,
                onEnd: function (evt) {
                    console.log('New command order:', evt.newIndex);
                    // Sauvegarder l'ordre des commandes ici si nécessaire
                    saveCommandOrder();
                }
            });
        }

        function saveCommandOrder() {
            const items = commandList.children;
            let newCommands = [];
            
            for (let item of items) {
                const title = item.querySelector('.command-title') 
                    ? item.querySelector('.command-title').textContent.trim()
                    : item.textContent.trim(); // Si `.command-title` n'est pas là, on récupère le texte de l'élément principal.
                    
                if (title) {
                    newCommands.push({ id: title.toLowerCase(), title: title });
                }
            }

            chrome.storage.sync.set({ commands: newCommands }, () => {
                chrome.runtime.sendMessage({ updateContextMenu: true });
                console.log("Command order saved");
            });
        }
    });
</script>
