console.log("ChatGPT extension content script loaded.");

// Global observer variable
let chatGPTObserver = null;
let isExtensionEnabled = false;  // Track extension state

// Request storage state from the background script
chrome.storage.local.get('extensionEnabled', function (data) {
    isExtensionEnabled = data.extensionEnabled || false;
    if (isExtensionEnabled) {
        activateChatsurfers();
    }
});

// Listen for messages from `popup.js`
chrome.runtime.onMessage.addListener(function (request) {
    isExtensionEnabled = request.enabled;
    if (request.enabled) {
        activateChatsurfers();
    } else {
        disableChatsurfers();
    }
});

function createPopup() {
    // Don't create popup if extension is disabled
    if (!isExtensionEnabled) return;

    let existingPopup = document.getElementById("chatgpt-popup");
    if (!existingPopup) {
        let popup = document.createElement("div");
        popup.id = "chatgpt-popup";
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.right = "20px";
        popup.style.backgroundColor = "black";
        popup.style.padding = "10px";
        popup.style.borderRadius = "5px";
        popup.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)";
        popup.style.zIndex = "10000";
        popup.style.display = "flex";
        popup.style.flexDirection = "column";

        let contentContainer = document.createElement("div");
        contentContainer.style.position = "relative";
        contentContainer.style.width = "100%";

        let video = document.createElement("video");
        video.id = "chatgpt-video";
        video.src = chrome.runtime.getURL("video/videoplayback.mp4");
        video.width = 400;
        video.height = 250;
        video.muted = true;
        video.autoplay = true;
        video.loop = true;

        let disableBtn = document.createElement("button");
        disableBtn.innerText = "Disable";
        disableBtn.style.position = "absolute";
        disableBtn.style.top = "10px";
        disableBtn.style.right = "10px";
        disableBtn.style.padding = "8px 16px";
        disableBtn.style.fontSize = "14px";
        disableBtn.style.border = "none";
        disableBtn.style.borderRadius = "5px";
        disableBtn.style.backgroundColor = "red";
        disableBtn.style.color = "white";
        disableBtn.style.cursor = "pointer";
        disableBtn.style.zIndex = "1";

        disableBtn.addEventListener("mouseover", () => {
            disableBtn.style.backgroundColor = "#ff4444";
        });
        disableBtn.addEventListener("mouseout", () => {
            disableBtn.style.backgroundColor = "red";
        });

        disableBtn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            isExtensionEnabled = false;
            chrome.storage.local.set({ extensionEnabled: false }, function () {
                console.log("Extension disabled from content script.");
                chrome.runtime.sendMessage({ enabled: false });
                disableChatsurfers();
            });
        });

        contentContainer.appendChild(video);
        contentContainer.appendChild(disableBtn);
        popup.appendChild(contentContainer);
        document.body.appendChild(popup);

        video.play().catch(error => console.log("Autoplay prevented:", error));
    }
}

function removePopup() {
    let popup = document.getElementById("chatgpt-popup");
    if (popup) {
        // Stop video playback
        let video = popup.querySelector('video');
        if (video) {
            video.pause();
            video.src = "";
            video.load();
        }
        popup.remove();
        console.log("Popup removed successfully");
    }
}

function isChatGPTResponding() {
    if (!isExtensionEnabled) return false;
    const stopButton = document.querySelector('button[data-testid="stop-button"]');
    const sendButton = document.querySelector('button[data-testid="send-button"]');
    return (stopButton !== null) || (sendButton && sendButton.disabled);
}

function observeChatGPTButton() {
    if (!isExtensionEnabled) return;

    const chatContainer = document.body;
    if (!chatContainer) {
        console.warn("ChatGPT container not found. Retrying...");
        setTimeout(observeChatGPTButton, 1000);
        return;
    }

    if (chatGPTObserver) {
        chatGPTObserver.disconnect();
    }

    chatGPTObserver = new MutationObserver(() => {
        if (isExtensionEnabled && isChatGPTResponding()) {
            console.log("ChatGPT is responding...");
            createPopup();
        } else {
            console.log("ChatGPT response complete or extension disabled.");
            removePopup();
        }
    });

    chatGPTObserver.observe(chatContainer, { childList: true, subtree: true });
    console.log("ChatGPT observer started.");
}

function activateChatsurfers() {
    console.log("Chatsurfers Enabled");
    isExtensionEnabled = true;
    observeChatGPTButton();
}

function disableChatsurfers() {
    console.log("Chatsurfers Disabled");
    isExtensionEnabled = false;

    if (chatGPTObserver) {
        chatGPTObserver.disconnect();
        chatGPTObserver = null;
    }

    removePopup();
}

// Only start if extension is enabled
if (isExtensionEnabled) {
    observeChatGPTButton();
}