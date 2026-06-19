// === DOM Elements ===
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const themeSelect = document.getElementById('themeSelect');
const fontToggle = document.getElementById('fontToggle');
const effectToggle = document.getElementById('effectToggle');
const textLarger = document.getElementById('textLarger');
const textSmaller = document.getElementById('textSmaller');

const root = document.documentElement; // The <html> tag
const body = document.body;

// === Settings Panel Toggle ===
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

// === Theme Switching ===
themeSelect.addEventListener('change', (e) => {
    const selectedTheme = e.target.value;
    root.setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
});

// === Dyslexia-Friendly Font Toggle ===
fontToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        body.classList.add('readable-font');
        localStorage.setItem('readableFont', 'true');
    } else {
        body.classList.remove('readable-font');
        localStorage.setItem('readableFont', 'false');
    }
});

// === Disable Visual Effects Toggle ===
effectToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        body.classList.add('no-effects');
        localStorage.setItem('noEffects', 'true');
    } else {
        body.classList.remove('no-effects');
        localStorage.setItem('noEffects', 'false');
    }
});

// === Text Size Adjustment ===
let currentFontSize = 16; // Default base size in px

function updateFontSize() {
    root.style.fontSize = `${currentFontSize}px`;
    localStorage.setItem('fontSize', currentFontSize);
}

textLarger.addEventListener('click', () => {
    if (currentFontSize < 24) {
        currentFontSize += 2;
        updateFontSize();
    }
});

textSmaller.addEventListener('click', () => {
    if (currentFontSize > 12) {
        currentFontSize -= 2;
        updateFontSize();
    }
});

// === Load Saved Settings on Page Load ===
function loadSettings() {
    // Load Theme
    const savedTheme = localStorage.getItem('theme') || 'overwatch';
    root.setAttribute('data-theme', savedTheme);
    themeSelect.value = savedTheme;

    // Load Font
    if (localStorage.getItem('readableFont') === 'true') {
        body.classList.add('readable-font');
        fontToggle.checked = true;
    }

    // Load Effects
    if (localStorage.getItem('noEffects') === 'true') {
        body.classList.add('no-effects');
        effectToggle.checked = true;
    }

    // Load Font Size
    const savedFontSize = parseInt(localStorage.getItem('fontSize')) || 16;
    currentFontSize = savedFontSize;
    updateFontSize();
}

// Initialize settings on script load
loadSettings();

// === Login Logic (Placeholder) ===
function attemptLogin(event) {
    event.preventDefault();
    const citizenId = document.getElementById('citizenId').value;
    const errorDiv = document.getElementById('loginError');
    
    // Placeholder: In the future, this checks against Firebase/Supabase
    if (citizenId.trim() === '') {
        errorDiv.textContent = "> ACCESS DENIED: INVALID CITIZEN ID";
    } else {
        errorDiv.textContent = "> UPLINK ESTABLISHED. REDIRECTING...";
        // window.location.href = 'dashboard.html';
    }
}
