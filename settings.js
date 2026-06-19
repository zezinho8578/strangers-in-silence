// --- settings.js ---
// Run immediately to prevent style flickering on load
(function initializeSettings() {
    // Load settings from local storage or set defaults
    const savedColor = localStorage.getItem('lambdaColor') || '#ff9900';
    const savedSize = localStorage.getItem('lambdaSize') || '22px';
    const savedScanlines = localStorage.getItem('lambdaScanlines') || 'block';

    // Apply to CSS variables
    document.documentElement.style.setProperty('--theme-color', savedColor);
    document.documentElement.style.setProperty('--font-size', savedSize);
    document.documentElement.style.setProperty('--scanline-display', savedScanlines);

    // Wait for DOM to finish loading to inject the modal
    document.addEventListener('DOMContentLoaded', () => {
        injectSettingsModal();
    });
})();

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
                    <option value="#ff9900">Lambda Orange</option>
                    <option value="#00ccff">Combine Blue</option>
                    <option value="#33ff33">Terminal Green</option>
                    <option value="#ffffff">High Contrast White</option>
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
                    <option value="none">Disabled (Accessibility)</option>
                </select>
            </div>

            <div class="setting-row">
                <span>AUDIO:</span>
                <select id="set-audio">
                    <option value="on">Enabled</option>
                    <option value="off">Muted</option>
                </select>
            </div>

            <button id="logout-btn" class="danger-btn" style="width: 100%; margin-bottom: 10px;">[ TERMINATE SESSION ]</button>
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
    document.getElementById('set-theme').value = localStorage.getItem('lambdaColor') || '#ff9900';
    document.getElementById('set-size').value = localStorage.getItem('lambdaSize') || '22px';
    document.getElementById('set-scanlines').value = localStorage.getItem('lambdaScanlines') || 'block';
    document.getElementById('set-audio').value = localStorage.getItem('lambdaAudio') || 'on';

    // Event Listeners for Opening/Closing
    btnOpen.addEventListener('click', () => modal.style.display = 'block');
    btnClose.addEventListener('click', () => modal.style.display = 'none');

    // Event Listeners for Changes
    document.getElementById('set-theme').addEventListener('change', (e) => {
        document.documentElement.style.setProperty('--theme-color', e.target.value);
        localStorage.setItem('lambdaColor', e.target.value);
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

    // Logout Logic
    btnLogout.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('promptedStatus');
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('promptedStatus');
        window.location.href = 'index.html'; // Kick back to login
    });
}
