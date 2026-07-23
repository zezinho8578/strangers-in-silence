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
function computeArmorPipeline(target, weaponDmgType, ap, opts = {}) {
    const t = normalizeArmorData(JSON.parse(JSON.stringify(target)));
    const naturalArmor = parseInt(t.naturalArmor) || 0;
    const wornArmor = parseInt(t.wornArmor) || 0;
    const bp = parseInt(t.ballisticProtection) || 0;
    const ff = parseInt(t.forceField) || 0;
    const toughness = (toughnessOverride !== null)
    ? toughnessOverride
    : (parseInt(t.toughness) || 0);
    const armorType = t.armorType || "General";
    const heavyArmor = !!t.heavyArmor;

    // Part 4: Called Shots / Weak Points
    const bypassWorn = !!opts.bypassWorn;
    const bypassNatural = !!opts.bypassNatural;

    const toughnessOverrideRaw =
        (opts.toughnessOverride === undefined || opts.toughnessOverride === null || opts.toughnessOverride === "")
            ? null
            : parseInt(opts.toughnessOverride);

    const toughnessOverride =
        (toughnessOverrideRaw !== null && !isNaN(toughnessOverrideRaw))
            ? toughnessOverrideRaw
            : null;

    const calledShotId = opts.id || opts.calledShot || null;
    const calledShotLabel = opts.label || "";
    const calledShotDmg = parseInt(opts.dmgMod) || 0;

    // Step 1: Determine which armor layers apply based on damage type
    // Natural armor is whole-body unless a called shot / weak point explicitly bypasses it.
    const naturalApplies = !bypassNatural;

    // Worn armor applies based on called-shot bypass and armorType vs damageType.
    let wornApplies = !bypassWorn;
    if (armorType === "Ballistic" && weaponDmgType !== "Ballistic") wornApplies = false;
    if (armorType === "Energy" && weaponDmgType !== "Energy") wornApplies = false;

    // Step 2: Ballistic Protection reduces AP (only vs Ballistic attacks, only if armor applies)
    let effectiveAP = ap.ignore ? 0 : ap.amount;
    let bpApplied = 0;
    if (!ap.ignore && weaponDmgType === "Ballistic" && bp > 0 && wornApplies) {
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
        apIgnore: ap.ignore, apLabel: ap.label, apAmount: ap.amount,
        bypassWorn,
        bypassNatural,
        toughnessOverride,
        calledShot: calledShotId,
        calledShotLabel,
        calledShotDmg
    };
}

// --- Human-readable breakdown string ---
function buildDamageBreakdown(damageTotal, p) {
let damageLabel = damageTotal;
if (p.calledShotDmg > 0) damageLabel += ` (incl. +${p.calledShotDmg} called shot)`;

let s = `${damageLabel} damage vs Tgh ${p.toughness}`;
if (p.calledShotLabel) s += ` [${p.calledShotLabel}]`;

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

    if (p.bypassWorn && p.wornArmor > 0 && p.applicableWorn === 0) {
        s += ` [worn armor bypassed]`;
    }
    if (p.bypassNatural && p.naturalArmor > 0 && p.applicableNatural === 0) {
        s += ` [natural armor bypassed]`;
    }

    s += ` = ${p.effectiveToughness}`;
    return s;
}

// --- Simple wrapper for code that just needs the number ---
function computeEffectiveToughness(toughness, armor, ap) {
    const effectiveArmor = ap.ignore ? 0 : Math.max(0, armor - Math.max(0, ap.amount));
    return toughness + effectiveArmor;
}

// ==========================================
// PART 4: CALLED SHOTS / WEAK POINTS / ARMOR DEGRADATION
// ==========================================

const CALLED_SHOTS = {
    none: {
        id: "none",
        label: "None",
        hitMod: 0,
        dmgMod: 0,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    head: {
        id: "head",
        label: "Head/Vitals (−4 hit, +4 dmg)",
        hitMod: -4,
        dmgMod: 4,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    limb: {
        id: "limb",
        label: "Limb (−2 hit)",
        hitMod: -2,
        dmgMod: 0,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    hand: {
        id: "hand",
        label: "Hand (−4 hit, disarm)",
        hitMod: -4,
        dmgMod: 0,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    gap: {
        id: "gap",
        label: "Unarmored gap (−4 hit, bypass worn)",
        hitMod: -4,
        dmgMod: 0,
        bypassWorn: true,
        bypassNatural: false,
        toughnessOverride: null
    }
};

function getCalledShotConfig(value, target) {
    if (value === "weakpoint" && target && target.weakPoint && target.weakPoint.enabled) {
        const wp = target.weakPoint;
        let hit = parseInt(wp.hitPenalty);
        if (isNaN(hit)) hit = -4;
        if (hit > 0) hit = -hit;

        return {
            id: "weakpoint",
            label: `Weak Point: ${wp.name || "Weak Point"}`,
            hitMod: hit,
            dmgMod: 0,
            bypassWorn: !!wp.bypassWorn,
            bypassNatural: !!wp.bypassNatural,
            toughnessOverride:
                (wp.toughnessOverride === undefined || wp.toughnessOverride === null || wp.toughnessOverride === "")
                    ? null
                    : parseInt(wp.toughnessOverride),
            notes: wp.notes || ""
        };
    }

    const base = CALLED_SHOTS[value] || CALLED_SHOTS.none;
    return JSON.parse(JSON.stringify(base));
}

function populateCalledShotSelect(selectEl, target) {
    if (!selectEl) return;

    const oldValue = selectEl.value || "none";

    selectEl.innerHTML = `
        <option value="none">None</option>
        <option value="head">Head/Vitals (−4 hit, +4 dmg)</option>
        <option value="limb">Limb (−2 hit)</option>
        <option value="hand">Hand (−4 hit, disarm)</option>
        <option value="gap">Unarmored gap (−4 hit, bypass worn)</option>
    `;

    if (target && target.weakPoint && target.weakPoint.enabled) {
        const wp = target.weakPoint;
        let hit = parseInt(wp.hitPenalty);
        if (isNaN(hit)) hit = -4;
        if (hit > 0) hit = -hit;

        let label = `Weak Point: ${wp.name || "Weak Point"} (${hit} hit`;
        if (wp.bypassWorn) label += ", bypass worn";
        if (wp.bypassNatural) label += ", bypass natural";
        if (wp.toughnessOverride !== undefined && wp.toughnessOverride !== null && wp.toughnessOverride !== "") {
            label += `, Tgh ${wp.toughnessOverride}`;
        }
        label += ")";

        const opt = document.createElement("option");
        opt.value = "weakpoint";
        opt.textContent = label;
        selectEl.appendChild(opt);
    }

    let newValue = oldValue;
    if (newValue === "weakpoint" && !(target && target.weakPoint && target.weakPoint.enabled)) {
        newValue = "none";
    }

    selectEl.value = newValue;
}

function getDieStep(dieStr) {
    if (!dieStr) return 4;
    const match = String(dieStr).match(/d?(\d+)/i);
    if (!match) return 4;
    const val = parseInt(match[1], 10);
    if (isNaN(val)) return 4;
    if (val <= 4) return 4;
    if (val >= 12) return 12;
    return val;
}

function dieStepIndex(dieStr) {
    const dice = [4, 6, 8, 10, 12];
    const val = getDieStep(dieStr);
    let idx = dice.indexOf(val);
    if (idx !== -1) return idx;

    if (val <= 4) return 0;
    if (val >= 12) return 4;

    let lower = 0;
    for (let i = 0; i < dice.length; i++) {
        if (dice[i] <= val) lower = i;
    }
    return lower;
}

function dieStepPenalty(strDie, minStr, extraSteps = 0) {
    const dice = [4, 6, 8, 10, 12];
    const strIdx = dieStepIndex(strDie);
    let reqIdx = dieStepIndex(minStr) + (parseInt(extraSteps) || 0);
    if (reqIdx < 0) reqIdx = 0;
    if (reqIdx > dice.length - 1) reqIdx = dice.length - 1;
    return Math.max(0, reqIdx - strIdx);
}

function normalizeArmorInstance(a, slot) {
    if (!a) return a;

    if (a.slot === undefined) a.slot = slot || null;
    if (a.degradationPolicy === undefined) a.degradationPolicy = a.degradation || "none";
    if (a.degradationParam === undefined) a.degradationParam = a.degradationParam || "";

    if (a.ruined === undefined) a.ruined = false;
    if (a.penetrationCount === undefined) a.penetrationCount = 0;

    const paramNum = parseInt(a.degradationParam) || 0;

    if (a.chargeMax === undefined) a.chargeMax = paramNum;
    if (a.chargeRemaining === undefined || a.chargeRemaining === null) {
        a.chargeRemaining = a.chargeMax;
    }

    return a;
}

function normalizeCharacterArmorInstances(data) {
    if (!data) return data;

    if (data.equippedArmor) normalizeArmorInstance(data.equippedArmor, "primary");
    if (data.equippedArmorSecondary) normalizeArmorInstance(data.equippedArmorSecondary, "secondary");
    if (data.equippedForceField) normalizeArmorInstance(data.equippedForceField, "forcefield");

    return data;
}

function isArmorInstanceActive(a) {
    if (!a || a.ruined) return false;

    if (a.degradationPolicy === "charge") {
        let rem = a.chargeRemaining;
        if (rem === undefined || rem === null) {
            rem = (a.chargeMax !== undefined && a.chargeMax !== null)
                ? a.chargeMax
                : (parseInt(a.degradationParam) || 0);
        }
        return (parseInt(rem) || 0) > 0;
    }

    return true;
}

function armorInstanceApplies(a, weaponDmgType) {
    if (!isArmorInstanceActive(a)) return false;

    const t = a.armorType || "General";
    if (t === "General") return true;
    return t === weaponDmgType;
}

function armorInstanceStatusLines(a) {
    if (!a) return [];

    normalizeArmorInstance(a, a.slot);

    const policyLabels = {
        none: "None",
        perWoundRoll: "Per-Wound Roll",
        threshold: "Threshold",
        charge: "Charge"
    };

    const lines = [];
    const policy = a.degradationPolicy || "none";

    lines.push(`DEGRADE: ${policyLabels[policy] || policy}`);

    if (policy === "threshold") {
        const threshold = parseInt(a.degradationParam) || 1;
        lines.push(`DURABILITY: ${a.penetrationCount || 0}/${threshold}`);
    }

    if (policy === "charge") {
        const max = (a.chargeMax !== undefined && a.chargeMax !== null)
            ? a.chargeMax
            : (parseInt(a.degradationParam) || 0);
        const rem = (a.chargeRemaining !== undefined && a.chargeRemaining !== null)
            ? a.chargeRemaining
            : max;
        lines.push(`CHARGE: ${rem}/${max}h`);
    }

    if (a.ruined) {
        if (policy === "charge" && ((parseInt(a.chargeRemaining) || 0) <= 0)) {
            lines.push(`STATUS: OFFLINE`);
        } else {
            lines.push(`STATUS: RUINED`);
        }
    } else {
        lines.push(`STATUS: OK`);
    }

    return lines;
}

function computeEquippedArmorPenalty(data) {
    if (!data) return 0;

    normalizeCharacterArmorInstances(data);

    const strDie = data.attributes?.Strength?.die || "d4";
    const primary = data.equippedArmor;
    const secondary = data.equippedArmorSecondary;

    if (primary && isArmorInstanceActive(primary)) {
        const extra = (secondary && isArmorInstanceActive(secondary)) ? 1 : 0;
        return dieStepPenalty(strDie, primary.minStr, extra);
    }

    if (secondary && isArmorInstanceActive(secondary)) {
        return dieStepPenalty(strDie, secondary.minStr, 0);
    }

    return 0;
}

function recalcCharacterDerived(data) {
    if (!data) return data;
    if (!data.derived) data.derived = {};

    normalizeCharacterArmorInstances(data);

    const nat = parseInt(data.naturalArmor) || 0;

    const primary = data.equippedArmor;
    const secondary = data.equippedArmorSecondary;
    const force = data.equippedForceField;

    let worn = 0;
    let ff = 0;
    let bp = 0;
    let armorType = "General";
    let heavy = false;

    if (primary && isArmorInstanceActive(primary)) {
        worn += parseInt(primary.armor) || 0;
        bp = parseInt(primary.ballisticProtection) || 0;
        armorType = primary.armorType || "General";
        heavy = !!primary.heavyArmor;
    }

    if (secondary && isArmorInstanceActive(secondary)) {
        worn += Math.floor((parseInt(secondary.armor) || 0) / 2);

        // Known modeling limitation:
        // participant stores one armorType/BP. If primary is inactive, fall back to secondary.
        if (!(primary && isArmorInstanceActive(primary))) {
            bp = parseInt(secondary.ballisticProtection) || 0;
            armorType = secondary.armorType || "General";
            heavy = !!secondary.heavyArmor;
        }
    }

    if (force && isArmorInstanceActive(force)) {
        ff = parseInt(force.armor) || 0;
    }

    const totalArmor = nat + worn + ff;

    const vigorDie = getDieStep(data.attributes?.Vigor?.die || "d4");
    const toughOverride = parseInt(data.derived.toughnessOverride) || 0;

    data.derived.naturalArmor = nat;
    data.derived.wornArmor = worn;
    data.derived.forceField = ff;
    data.derived.ballisticProtection = bp;
    data.derived.armorType = armorType;
    data.derived.heavyArmor = heavy;
    data.derived.armor = totalArmor;

    data.derived.toughness = 2 + (vigorDie / 2) + totalArmor + toughOverride;

    const basePace = parseInt(data.derived.pace) || 6;
    const penalty = computeEquippedArmorPenalty(data);

    data.derived.armorPenalty = penalty;
    data.derived.paceEffective = Math.max(1, basePace - penalty);

    return data;
}

function degradeCharacterArmor(data, info) {
    const logs = [];
    if (!data) return logs;

    normalizeCharacterArmorInstances(data);

    const weaponDmgType = info.weaponDmgType || "Ballistic";
    const woundsAdded = parseInt(info.woundsAdded) || 0;
    const bypassWorn = !!info.bypassWorn;
    const forceFieldApplied = !!info.forceFieldApplied;

    const layers = [
        { slot: "primary", inst: data.equippedArmor },
        { slot: "secondary", inst: data.equippedArmorSecondary },
        { slot: "forcefield", inst: data.equippedForceField }
    ];

    layers.forEach(({ slot, inst }) => {
        if (!inst || inst.ruined) return;

        const policy = inst.degradationPolicy || "none";
        if (policy === "none") return;

        // Force fields: battery/charge model.
        if (slot === "forcefield") {
            if (policy === "charge" && forceFieldApplied) {
                const before = parseInt(inst.chargeRemaining) || 0;
                inst.chargeRemaining = Math.max(0, before - 1);

                logs.push(`${inst.name} force field consumed 1 hour of charge (${inst.chargeRemaining}h left).`);

                if ((parseInt(inst.chargeRemaining) || 0) <= 0) {
                    inst.ruined = true;
                    logs.push(`${inst.name} force field is OFFLINE.`);
                }
            }
            return;
        }

        // Worn layers:
        // If the attack explicitly bypasses worn armor, it does not impact that layer.
        if (bypassWorn) return;

        // If the layer does not apply to this damage type, it was not meaningfully stressed.
        if (!armorInstanceApplies(inst, weaponDmgType)) return;

        // Only penetrating wounds degrade worn armor.
        if (woundsAdded <= 0) return;

        if (policy === "perWoundRoll") {
            const rolls = [];
            let ruined = false;

            for (let i = 0; i < woundsAdded; i++) {
                const r = 1 + Math.floor(Math.random() * 6);
                rolls.push(r);
                if (r % 2 === 1) ruined = true;
            }

            logs.push(`${inst.name} degradation rolls: [${rolls.join(", ")}] → ${ruined ? "RUINED" : "intact"}.`);

            if (ruined) {
                inst.ruined = true;
            }
        } else if (policy === "threshold") {
            const threshold = parseInt(inst.degradationParam) || 1;
            inst.penetrationCount = (parseInt(inst.penetrationCount) || 0) + woundsAdded;

            logs.push(`${inst.name} absorbed ${woundsAdded} penetrating wound(s) (${inst.penetrationCount}/${threshold}).`);

            if (inst.penetrationCount >= threshold) {
                inst.ruined = true;
                logs.push(`${inst.name} is RUINED.`);
            }
        } else if (policy === "charge") {
            // Rare case: a worn powered armor layer with charge.
            const before = parseInt(inst.chargeRemaining) || 0;
            inst.chargeRemaining = Math.max(0, before - 1);

            logs.push(`${inst.name} consumed 1 hour of charge (${inst.chargeRemaining}h left).`);

            if ((parseInt(inst.chargeRemaining) || 0) <= 0) {
                inst.ruined = true;
                logs.push(`${inst.name} is OFFLINE.`);
            }
        }
    });

    return logs;
}

// Expose Part 4 helpers globally for page modules.
window.CALLED_SHOTS = CALLED_SHOTS;
window.getCalledShotConfig = getCalledShotConfig;
window.populateCalledShotSelect = populateCalledShotSelect;
window.getDieStep = getDieStep;
window.dieStepIndex = dieStepIndex;
window.dieStepPenalty = dieStepPenalty;
window.normalizeArmorInstance = normalizeArmorInstance;
window.normalizeCharacterArmorInstances = normalizeCharacterArmorInstances;
window.isArmorInstanceActive = isArmorInstanceActive;
window.armorInstanceApplies = armorInstanceApplies;
window.armorInstanceStatusLines = armorInstanceStatusLines;
window.computeEquippedArmorPenalty = computeEquippedArmorPenalty;
window.recalcCharacterDerived = recalcCharacterDerived;
window.degradeCharacterArmor = degradeCharacterArmor;

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
