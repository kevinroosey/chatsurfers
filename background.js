console.log("Background script running...");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed!");
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.enabled === false) {
        chrome.storage.local.set({ extensionEnabled: false });
        console.log("Extension disabled globally.");
    }
});

