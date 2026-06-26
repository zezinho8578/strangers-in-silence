// --- settings.js ---

// Theme configurations
const themeData = {
    'lambda': { color: '#ff9900', bg: '#050505', shadow: '0 0 5px var(--theme-color)', showLogo: 'block' },
    'combine': { color: '#00ccff', bg: '#050505', shadow: '0 0 5px var(--theme-color)', showLogo: 'none' },
    'terminal': { color: '#33ff33', bg: '#050505', shadow: '0 0 5px var(--theme-color)', showLogo: 'none' },
    'high-contrast': { color: '#ffffff', bg: '#000000', shadow: 'none', showLogo: 'none' },
    'light': { color: '#222222', bg: '#e0e0e0', shadow: 'none', showLogo: 'none' }
};

// Run immediately to prevent style flickering on load
(function initializeSettings() {
    // Load saved data
    const savedThemeId = localStorage.getItem('lambdaTheme') || 'lambda';
    const savedSize = localStorage.getItem('lambdaSize') || '22px';
    const savedScanlines = localStorage.getItem('lambdaScanlines') || 'block';
    const savedFont = localStorage.getItem('lambdaFont') || "'VT323', monospace";

    // Apply basic CSS variables immediately
    const theme = themeData[savedThemeId];
    document.documentElement.style.setProperty('--theme-color', theme.color);
    document.documentElement.style.setProperty('--bg-color', theme.bg);
    document.documentElement.style.setProperty('--text-shadow-glow', theme.shadow);
    
    document.documentElement.style.setProperty('--font-size', savedSize);
    document.documentElement.style.setProperty('--scanline-display', savedScanlines);
    document.documentElement.style.setProperty('--font-family', savedFont);

    // Wait for DOM to finish loading to inject modal and update the logo image
    document.addEventListener('DOMContentLoaded', () => {
        updateLogoVisibility(theme.showLogo);
        injectSettingsModal();
    });
})();

function updateLogoVisibility(displayState) {
    const logo = document.getElementById('bg-lambda');
    if (logo) {
        logo.style.display = displayState;
    }
}

function injectSettingsModal() {
    // Inject the Settings Button if it doesn't exist
    if (!document.getElementById('settings-btn')) {
        const btn = document.createElement('div');
        btn.id = 'settings-btn';
        btn.innerText = '[ SYSTEM SETTINGS ]';
        document.body.appendChild(btn);
    }

    // Create the Modal HTML
    const modalHTML = `
        <div id="settings-modal">
            <h2>SYSTEM_PREFERENCES</h2>
            
            <div class="setting-row">
                <span>UI THEME:</span>
                <select id="set-theme">
                    <option value="lambda">Lambda Orange</option>
                    <option value="combine">Combine Blue</option>
                    <option value="terminal">Terminal Green</option>
                    <option value="high-contrast">High Contrast Dark</option>
                    <option value="light">Light Mode</option>
                </select>
            </div>

            <div class="setting-row">
                <span>FONT STYLE:</span>
                <select id="set-font">
                    <option value="'VT323', monospace">Retro (VT323)</option>
                    <option value="monospace">System Monospace</option>
                    <option value="sans-serif">System Sans-Serif</option>
                </select>
            </div>

            <div class="setting-row">
                <span>FONT SIZE:</span>
                <select id="set-size">
                    <option value="22px">Standard</option>
                    <option value="26px">Large</option>
                    <option value="32px">Extra Large</option>
                </select>
            </div>

            <div class="setting-row">
                <span>CRT SCANLINES:</span>
                <select id="set-scanlines">
                    <option value="block">Enabled</option>
                    <option value="none">Disabled</option>
                </select>
            </div>

            <div class="setting-row">
                <span>AUDIO:</span>
                <select id="set-audio">
                    <option value="on">Enabled</option>
                    <option value="off">Muted</option>
                </select>
            </div>

            <div class="setting-row">
                <span>SYNC NOTIFICATIONS:</span>
                <select id="set-sync-notif">
                    <option value="off">Disabled</option>
                    <option value="on">Enabled</option>
                </select>
            </div>

            <button id="logout-btn" class="danger-btn">[ TERMINATE SESSION ]</button>
            <button id="close-settings">[ CLOSE ]</button>
        </div>
    `;

    // Append to body
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);

    // Grab elements
    const modal = document.getElementById('settings-modal');
    const btnOpen = document.getElementById('settings-btn');
    const btnClose = document.getElementById('close-settings');
    const btnLogout = document.getElementById('logout-btn');
    
    // Set UI dropdowns to match current saved settings
    document.getElementById('set-theme').value = localStorage.getItem('lambdaTheme') || 'lambda';
    document.getElementById('set-font').value = localStorage.getItem('lambdaFont') || "'VT323', monospace";
    document.getElementById('set-size').value = localStorage.getItem('lambdaSize') || '22px';
    document.getElementById('set-scanlines').value = localStorage.getItem('lambdaScanlines') || 'block';
    document.getElementById('set-audio').value = localStorage.getItem('lambdaAudio') || 'on';
    document.getElementById('set-sync-notif').value = localStorage.getItem('lambdaSyncNotif') || 'off';

    // Event Listeners for Opening/Closing
    btnOpen.addEventListener('click', () => modal.style.display = 'block');
    btnClose.addEventListener('click', () => modal.style.display = 'none');

    // Event Listeners for Changes
    document.getElementById('set-theme').addEventListener('change', (e) => {
        const selectedTheme = themeData[e.target.value];
        
        document.documentElement.style.setProperty('--theme-color', selectedTheme.color);
        document.documentElement.style.setProperty('--bg-color', selectedTheme.bg);
        document.documentElement.style.setProperty('--text-shadow-glow', selectedTheme.shadow);
        
        updateLogoVisibility(selectedTheme.showLogo);
        localStorage.setItem('lambdaTheme', e.target.value);
    });

    document.getElementById('set-font').addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--font-family', e.target.value);
        localStorage.setItem('lambdaFont', e.target.value);
    });

    document.getElementById('set-size').addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--font-size', e.target.value);
        localStorage.setItem('lambdaSize', e.target.value);
    });

    document.getElementById('set-scanlines').addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--scanline-display', e.target.value);
        localStorage.setItem('lambdaScanlines', e.target.value);
    });

    document.getElementById('set-audio').addEventListener('change', (e) => {
        localStorage.setItem('lambdaAudio', e.target.value);
    });

    document.getElementById('set-sync-notif').addEventListener('change', (e) => {
        localStorage.setItem('lambdaSyncNotif', e.target.value);
    });

    // Logout Logic
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('promptedStatus');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('promptedStatus');
        window.location.href = 'index.html'; 
    });
}
