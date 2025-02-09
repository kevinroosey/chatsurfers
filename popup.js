document.addEventListener('DOMContentLoaded', function () {
    const enableBtn = document.getElementById('enable-btn');
    const disableBtn = document.getElementById('disable-btn');

    // Get initial state
    chrome.storage.local.get('extensionEnabled', function (data) {
        const isEnabled = data.extensionEnabled || false;
        updateButtonStates(isEnabled);
    });

    enableBtn.addEventListener('click', function () {
        chrome.storage.local.set({ extensionEnabled: true }, function () {
            // Send message to content script
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { enabled: true });
            });
            updateButtonStates(true);
        });
    });

    disableBtn.addEventListener('click', function () {
        chrome.storage.local.set({ extensionEnabled: false }, function () {
            // Send message to content script
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { enabled: false });
            });
            updateButtonStates(false);
        });
    });

    function updateButtonStates(isEnabled) {
        enableBtn.disabled = isEnabled;
        disableBtn.disabled = !isEnabled;
    }
});
