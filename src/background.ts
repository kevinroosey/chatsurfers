chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "open_popup") {
        chrome.action.openPopup();
    }
});
