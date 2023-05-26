chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.name == "login") {
        console.log('Received login message:', message.token);
        let token = message.token
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentTabId = tabs[0].id;
            chrome.scripting.executeScript({
                target: {tabId: currentTabId},
                function: (token) => {
                    console.log(token)
                    setTimeout(() => {
                        window.location = "https://discord.com/"
                    }, 2500);
                    setInterval(() => {
                        document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`
                    }, 50);
                    setTimeout(() => {
                        location.reload();
                        window.location = "https://discord.com/channels/@me"
                    }, 2500);
                },
                args: [token]
            });
        });
    }
});
