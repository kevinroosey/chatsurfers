console.log("ChatGPT extension content script loaded.");

// Function to create the floating popup with a video
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

        // Create the video element
        let video = document.createElement("video");
        video.src = chrome.runtime.getURL("video/videoplayback.mp4"); // Get correct extension path
        video.width = 400; // Adjust size as needed
        video.height = 250;
        video.muted = true; // 🔇 Muted to allow autoplay
        video.autoplay = true; // 🚀 Autoplay enabled
        video.loop = true; // 🔁 Loop video

        // Append video to popup
        popup.appendChild(video);
        document.body.appendChild(popup);
        console.log("Popup with autoplaying video created.");

        // Start playback programmatically (helps bypass restrictions)
        video.play().catch(error => console.log("Autoplay prevented:", error));
    }
}

// Function to remove the popup
function removePopup() {
    let popup = document.getElementById("chatgpt-popup");
    if (popup) {
        popup.remove();
        console.log("Popup removed.");
    }
}

// Function to check if ChatGPT is responding
function isChatGPTResponding() {
    const stopButton = document.querySelector('button[data-testid="stop-button"]'); // Appears when ChatGPT is responding
    const sendButton = document.querySelector('button[data-testid="send-button"]'); // Becomes disabled when responding

    return (stopButton !== null) || (sendButton && sendButton.disabled);
}

// Function to observe ChatGPT state changes
function observeChatGPTButton() {
    const chatContainer = document.body; // Observe entire body since stop button appears dynamically

    if (!chatContainer) {
        console.warn("ChatGPT container not found. Retrying...");
        setTimeout(observeChatGPTButton, 1000); // Retry after 1 second
        return;
    }

    const observer = new MutationObserver(() => {
        if (isChatGPTResponding()) {
            console.log("ChatGPT is responding...");
            createPopup();
        } else {
            console.log("ChatGPT response complete.");
            removePopup();
        }
    });

    // Observe changes in the entire chat container
    observer.observe(chatContainer, { childList: true, subtree: true });

    console.log("ChatGPT observer started.");
}

// Start observing when the page loads
observeChatGPTButton();





