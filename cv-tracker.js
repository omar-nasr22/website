// CV Download Tracker using Google Sheets
// This script tracks CV downloads and saves them to a Google Sheet

const CV_TRACKER = {
    // Google Apps Script URL (replace with your deployed script URL)
    SCRIPT_URL:
        "https://script.google.com/macros/s/AKfycby-SqeF_Y4O__nxPZk85dcfg-6f2UZ733Dpz0LsysBW2OqOlaJjpRxvaKycaxC9AsVL/exec",

    // Initialize tracker
    init: function () {
        const cvDownloadBtn = document.getElementById("cv-download-btn");
        if (cvDownloadBtn) {
            cvDownloadBtn.addEventListener("click", () => this.trackDownload());
        }

        // Load and display current count
        this.loadDownloadCount();
    },

    // Track download event
    trackDownload: async function () {
        try {
            // Get current timestamp
            const timestamp = new Date().toISOString();

            // Get user info (optional - can be expanded)
            const userAgent = navigator.userAgent;
            const referrer = document.referrer || "Direct";

            // Send data to Google Sheets
            const response = await fetch(this.SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    action: "trackDownload",
                    timestamp: timestamp,
                    userAgent: userAgent,
                    referrer: referrer,
                    ip: "Unknown",
                }).toString(),
            });

            console.log("CV download tracked successfully");

            // Update local count
            this.updateLocalCount();
        } catch (error) {
            console.error("Error tracking download:", error);
        }
    },

    // Load download count from localStorage
    loadDownloadCount: function () {
        const count = localStorage.getItem("cvDownloadCount") || "0";
        console.log("Total CV Downloads (local):", count);
    },

    // Update local download count
    updateLocalCount: function () {
        let count = parseInt(localStorage.getItem("cvDownloadCount") || "0");
        count++;
        localStorage.setItem("cvDownloadCount", count.toString());
        console.log("Updated CV Downloads:", count);
    },
};

// Initialize tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CV_TRACKER.init();
});
