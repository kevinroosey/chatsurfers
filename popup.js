

document.addEventListener("DOMContentLoaded", function () {
    const enableBtn = document.getElementById("enable-btn");
    const disableBtn = document.getElementById("disable-btn");

    if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get("extensionEnabled", function (data) {
            const isEnabled = data.extensionEnabled ?? true; // Default: enabled
            updateButtonStates(isEnabled);
        });

        function updateButtonStates(isEnabled) {
            enableBtn.disabled = isEnabled;
            disableBtn.disabled = !isEnabled;
        }

        enableBtn.addEventListener("click", function () {
            chrome.storage.local.set({ extensionEnabled: true });
            updateButtonStates(true);
        });

        disableBtn.addEventListener("click", function () {
            chrome.storage.local.set({ extensionEnabled: false });
            updateButtonStates(false);
        });
    } else {
        console.warn("chrome.storage API is not available. Make sure this is running in an extension context.");
    }
});
