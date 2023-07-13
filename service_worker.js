chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.name == "login") {
        console.log('Received login message:', message.token);
        let token = message.token
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: {tabId: currentTabId},
                function: (token) => {
                    setInterval(() => {
                        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
                    }, 50);
                    setTimeout(() => {
                        location.reload();
                    }, 2500);
                },
                args: [token]
            });
        });
    }
});
