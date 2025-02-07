function createPopup() {
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
        popup.style.alignItems = "center";

        // Create the video element
        let video = document.createElement("video");
        video.src = chrome.runtime.getURL("video/videoplayback.mp4"); // Get correct extension path
        video.width = 400; // Adjust size as needed
        video.height = 250;
        video.muted = true; // 🔇 Muted to allow autoplay
        video.autoplay = true; // 🚀 Autoplay enabled
        video.loop = true; // 🔁 Loop video

        // Create the Disable Extension button
        let disableBtn = document.createElement("button");
        disableBtn.innerText = "Disable Extension";
        disableBtn.style.marginTop = "10px";
        disableBtn.style.padding = "8px 16px";
        disableBtn.style.fontSize = "14px";
        disableBtn.style.border = "none";
        disableBtn.style.borderRadius = "5px";
        disableBtn.style.backgroundColor = "red";
        disableBtn.style.color = "white";
        disableBtn.style.cursor = "pointer";
        disableBtn.style.transition = "background-color 0.2s ease-in-out";

        // Button hover effect
        disableBtn.addEventListener("mouseover", function () {
            disableBtn.style.backgroundColor = "darkred";
        });
        disableBtn.addEventListener("mouseout", function () {
            disableBtn.style.backgroundColor = "red";
        });

        // Disable button click event
        disableBtn.addEventListener("click", function () {
            chrome.storage.local.set({ extensionEnabled: false }, function () {
                console.log("Extension disabled from content script.");

                // Notify popup and background scripts
                chrome.runtime.sendMessage({ enabled: false });

                // Remove popup
                removePopup();
            });
        });

        // Append video and button to popup
        popup.appendChild(video);
        popup.appendChild(disableBtn);
        document.body.appendChild(popup);
        console.log("Popup with autoplaying video created.");

        // Start playback programmatically (helps bypass restrictions)
        video.play().catch(error => console.log("Autoplay prevented:", error));
    }
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.enabled === false) {
        console.log("Received disable request from content script.");
        chrome.storage.local.set({ extensionEnabled: false }, function () {
            updateButtonStates(false);
        });
    }
});


console.log("ChatGPT extension content script loaded.");

// Request storage state from the background script
chrome.runtime.sendMessage({ action: "getExtensionState" }, function (response) {
    if (response && response.enabled) {
        activateChatsurfers();
    }
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener(function (request) {
    if (request.enabled) {
        activateChatsurfers();
    } else {
        disableChatsurfers();
    }
});

function activateChatsurfers() {
    console.log("Chatsurfers Enabled");
    // Add your feature code here
}

function disableChatsurfers() {
    console.log("Chatsurfers Disabled");
    // Cleanup logic (e.g., remove event listeners)
}







