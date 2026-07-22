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
    // --- SET UNIVERSAL FAVICON ---
    // You can replace this URL with a local path like "/favicon.ico" or "/favicon.png"
    const faviconUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Orange_lambda.svg/1280px-Orange_lambda.svg.png"; 
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png'; // Change to 'image/x-icon' if utilizing a .ico file
        document.head.appendChild(link);
    }
    link.href = faviconUrl;
    // -----------------------------

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

// ==========================================
// SHARED ARMOR/AP UTILITIES (used by all pages)
// ==========================================

function parseApForDamage(ap) {
    const raw = (ap === undefined || ap === null) ? "0" : String(ap);
    const lower = raw.toLowerCase();
    if (lower.includes("ignore")) {
        return { amount: 999, ignore: true, label: raw.trim() || "Ignore Armor" };
    }
    const match = lower.match(/-?\d+/);
    if (!match) {
        return { amount: 0, ignore: false, label: raw.trim() || "0" };
    }
    return { amount: parseInt(match[0], 10), ignore: false, label: raw.trim() || match[0] };
}

// --- Migration: normalize old single-armor targets to new layered model ---
function normalizeArmorData(target) {
    if (!target) return target;
    // If old-format (has 'armor' but no 'naturalArmor'/'wornArmor'), migrate
    if (target.naturalArmor === undefined && target.wornArmor === undefined) {
        target.wornArmor = parseInt(target.armor) || 0;
        target.naturalArmor = 0;
    }
    if (target.naturalArmor === undefined) target.naturalArmor = 0;
    if (target.wornArmor === undefined) target.wornArmor = 0;
    if (target.ballisticProtection === undefined) target.ballisticProtection = 0;
    if (target.forceField === undefined) target.forceField = 0;
    if (target.armorType === undefined) target.armorType = "General";
    // Recompute total 'armor' for display/backward compat
    target.armor = (parseInt(target.naturalArmor) || 0)
                 + (parseInt(target.wornArmor) || 0)
                 + (parseInt(target.forceField) || 0);
    return target;
}

// --- Main armor pipeline: single source of truth for all armor math ---
function computeArmorPipeline(target, weaponDmgType, ap) {
    const t = normalizeArmorData(JSON.parse(JSON.stringify(target)));
    const naturalArmor = parseInt(t.naturalArmor) || 0;
    const wornArmor = parseInt(t.wornArmor) || 0;
    const bp = parseInt(t.ballisticProtection) || 0;
    const ff = parseInt(t.forceField) || 0;
    const toughness = parseInt(t.toughness) || 0;
    const armorType = t.armorType || "General";
    const heavyArmor = !!t.heavyArmor;

    // Step 1: Determine which armor layers apply based on damage type
    // Natural armor is always General (applies to everything)
    const naturalApplies = true;

    // Worn armor applies based on its armorType vs the weapon's damageType
    let wornApplies = true;
    if (armorType === "Ballistic" && weaponDmgType !== "Ballistic") wornApplies = false;
    if (armorType === "Energy" && weaponDmgType !== "Energy") wornApplies = false;

    // Step 2: Ballistic Protection reduces AP (only vs Ballistic attacks, only if armor applies)
    let effectiveAP = ap.ignore ? 0 : ap.amount;
    let bpApplied = 0;
    if (!ap.ignore && weaponDmgType === "Ballistic" && bp > 0 && (naturalApplies || wornApplies)) {
        bpApplied = Math.min(bp, ap.amount);
        effectiveAP = Math.max(0, ap.amount - bp);
    }

    // Step 3: Calculate applicable armor after AP
    const applicableNatural = naturalApplies ? naturalArmor : 0;
    const applicableWorn = wornApplies ? wornArmor : 0;
    const totalApplicableArmor = applicableNatural + applicableWorn;
    const armorAfterAP = ap.ignore ? 0 : Math.max(0, totalApplicableArmor - effectiveAP);

    // Step 4: Force Field (always applies, ignores AP entirely)
    const totalArmor = armorAfterAP + ff;

    // Step 5: Effective Toughness
    const effectiveToughness = toughness + totalArmor;

    return {
        naturalArmor, wornArmor, ballisticProtection: bp, forceField: ff,
        toughness, armorType, heavyArmor,
        naturalApplies, wornApplies,
        bpApplied, effectiveAP,
        applicableNatural, applicableWorn, totalApplicableArmor,
        armorAfterAP, totalArmor, effectiveToughness,
        apIgnore: ap.ignore, apLabel: ap.label, apAmount: ap.amount
    };
}

// --- Human-readable breakdown string ---
function buildDamageBreakdown(damageTotal, p) {
    let s = `${damageTotal} damage vs Tgh ${p.toughness}`;

    if (p.apIgnore) {
        // Ignore Armor: bypasses natural+worn, but force field still stands
        if (p.totalApplicableArmor > 0) {
            s += ` + Armor ${p.totalApplicableArmor} (ignored by AP ${p.apLabel})`;
        }
    } else {
        // Show armor composition if both layers exist
        if (p.applicableNatural > 0 && p.applicableWorn > 0) {
            s += ` + Armor ${p.totalApplicableArmor} (Nat ${p.applicableNatural} + Worn ${p.applicableWorn})`;
        } else if (p.totalApplicableArmor > 0) {
            s += ` + Armor ${p.totalApplicableArmor}`;
        } else if (!p.naturalApplies || !p.wornApplies) {
            s += ` + Armor 0 (${p.armorType} armor vs ${p.apLabel})`;
        }

        // Show BP if it was applied
        if (p.bpApplied > 0) {
            s += ` [BP ${p.bpApplied} → eff AP ${p.effectiveAP}]`;
        }

        // Show AP reduction
        if (p.effectiveAP > 0 && p.totalApplicableArmor > 0) {
            s += ` − AP ${p.effectiveAP}`;
        }
    }

    // Force field (always shown if > 0)
    if (p.forceField > 0) {
        s += ` + FF ${p.forceField} (ignores AP)`;
    }

    s += ` = ${p.effectiveToughness}`;
    return s;
}

// --- Simple wrapper for code that just needs the number ---
function computeEffectiveToughness(toughness, armor, ap) {
    const effectiveArmor = ap.ignore ? 0 : Math.max(0, armor - Math.max(0, ap.amount));
    return toughness + effectiveArmor;
}

// --- Validation warnings for threat editor ---
function validateThreatTemplate(t) {
    const warnings = [];
    if (!t) return warnings;

    // Check Toughness vs expected
    const vigorStr = (t.attributes && t.attributes.Vigor) ? String(t.attributes.Vigor) : "d6";
    const vigorMatch = vigorStr.match(/d(\d+)/);
    const vigorDie = vigorMatch ? parseInt(vigorMatch[1]) : 6;
    const totalArmor = (parseInt(t.naturalArmor) || 0) + (parseInt(t.wornArmor) || 0) + (parseInt(t.forceField) || 0);
    const scale = parseInt(t.scale) || 0;
    const expectedToughness = 2 + Math.floor(vigorDie / 2) + totalArmor + scale;
    const actualToughness = parseInt(t.toughness) || 0;
    if (actualToughness !== expectedToughness) {
        warnings.push(`\u26a0 Toughness (${actualToughness}) \u2260 expected ${expectedToughness} (2 + Vig ${vigorDie}/2 + Armor ${totalArmor} + Scale ${scale}). May be intentional.`);
    }

    // Check Parry vs expected
    const fightStr = (t.skills && t.skills.Fighting) ? String(t.skills.Fighting) : "d4";
    const fightMatch = fightStr.match(/d(\d+)/);
    const fightDie = fightMatch ? parseInt(fightMatch[1]) : 4;
    const expectedParry = 2 + Math.floor(fightDie / 2);
    const actualParry = parseInt(t.parry) || 0;
    if (actualParry !== expectedParry) {
        warnings.push(`\u26a0 Parry (${actualParry}) \u2260 expected ${expectedParry} (2 + Fighting ${fightDie}/2). May be intentional.`);
    }

    // Armor stacking note
    const nat = parseInt(t.naturalArmor) || 0;
    const worn = parseInt(t.wornArmor) || 0;
    if (nat > 0 && worn > 0) {
        warnings.push(`\u2139 Natural (${nat}) + Worn (${worn}) = ${nat + worn}. SWADE: natural stacks at full value with worn.`);
    }

    return warnings;
}
