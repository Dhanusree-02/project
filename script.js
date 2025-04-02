// Blacklist arrays
const maliciousDomains = [
    "no-ip.biz",
    "3322.org",
    "no-ip.info",
    "no-ip.org",
    "dyndns.org",
    "yi.org",
    "vicp.net",
    "gicp.net",
    "zapto.org",
    "mooo.com",
    "indorummy.com"
];

const maliciousTLDs = [
    ".co",
    ".net",
    ".info",
    ".org",
    ".biz",
    ".cn",
    ".ru",
    ".tk",
    ".ml",
    ".ga"
];

let safeURL = ""; // Store the safe URL temporarily

async function checkURL() {
    const urlInput = document.getElementById("urlInput");
    const resultOutput = document.getElementById("result");
    const checkBtn = document.getElementById("checkBtn");
    const openLinkBtn = document.getElementById("openLinkBtn");
    const tryAnotherBtn = document.getElementById("tryAnotherBtn");

    const url = urlInput.value;
    resultOutput.innerText = "Checking...";
    resultOutput.className = "checking";

    let isValid = true;
    try {
        new URL(url);
    } catch {
        isValid = false;
    }

    if (!isValid) {
        resultOutput.innerText = "Invalid URL!";
        resultOutput.className = "unsafe";
        toggleButtons(checkBtn, tryAnotherBtn);
        return;
    }

    const domain = new URL(url).hostname;
    const tld = domain.slice(domain.lastIndexOf("."));

    if (maliciousDomains.includes(domain)) {
        resultOutput.innerText = "Unsafe URL ";
        resultOutput.className = "unsafe";
        toggleButtons(checkBtn, tryAnotherBtn);
        return;
    }

    if (maliciousTLDs.includes(tld)) {
        resultOutput.innerText = "Suspicious URL";
        resultOutput.className = "unsafe";
        toggleButtons(checkBtn, tryAnotherBtn);
        return;
    }

    const apiKey = "AIzaSyDJKo6Nf__sCqfW6Ci6Qgj6kWg3KmjQH44"; // Replace with your Google API key
    const apiURL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
    const body = {
        client: { clientId: "URLSafetyChecker", clientVersion: "1.0" },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
        }
    };

    try {
        const response = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const result = await response.json();

        if (Object.keys(result).length > 0) {
            resultOutput.innerText = "Unsafe URL ";
            resultOutput.className = "unsafe";
        } else {
            resultOutput.innerText = "Safe URL";
            resultOutput.className = "safe";
            safeURL = url; // Store the safe URL for the "Open Link" button
            openLinkBtn.style.display = "block";
        }
    } catch (error) {
        console.error("Error checking URL via Google Safe Browsing API:", error);
        resultOutput.innerText = "Error checking URL!";
        resultOutput.className = "unsafe";
    } finally {
        toggleButtons(checkBtn, tryAnotherBtn);
    }
}

function openSafeURL() {
    if (safeURL) {
        window.open(safeURL, "_blank"); // Open the stored safe URL in a new tab
    }
}

function resetForm() {
    const urlInput = document.getElementById("urlInput");
    const resultOutput = document.getElementById("result");
    const checkBtn = document.getElementById("checkBtn");
    const openLinkBtn = document.getElementById("openLinkBtn");
    const tryAnotherBtn = document.getElementById("tryAnotherBtn");

    urlInput.value = "";
    resultOutput.innerText = "";
    resultOutput.className = "";
    safeURL = ""; // Clear the stored safe URL
    toggleButtons(tryAnotherBtn, checkBtn);
    openLinkBtn.style.display = "none"; // Hide the "Open Link" button
}

function toggleButtons(hideBtn, showBtn) {
    hideBtn.style.display = "none";
    showBtn.style.display = "block";
}
