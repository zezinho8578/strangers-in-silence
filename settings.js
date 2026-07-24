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
    const armorType = t.armorType || "General";
    const heavyArmor = !!t.heavyArmor;

    // Part 4: Called Shots / Weak Points
    const bypassWorn = !!opts.bypassWorn;
    const bypassNatural = !!opts.bypassNatural;

    const toughnessOverrideRaw =
        (opts.toughnessOverride === undefined || opts.toughnessOverride === null || opts.toughnessOverride === "" || isNaN(parseInt(opts.toughnessOverride)))
            ? null
            : parseInt(opts.toughnessOverride);

    const toughnessOverride =
        (toughnessOverrideRaw !== null && !isNaN(toughnessOverrideRaw))
            ? toughnessOverrideRaw
            : null;

    // NOTE: toughness must be read AFTER toughnessOverride is declared above.
    // Previously it sat above the const declaration and fell in the temporal
    // dead zone, throwing ReferenceError and breaking every damage calc that
    // relied on this pipeline (called-shot/weak-point damage application,
    // the effective-toughness preview, and tracker.html's manual damage tool).
    const toughness = (toughnessOverride !== null)
        ? toughnessOverride
        : (parseInt(t.toughness) || 0);

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
        label: "Head/Vitals",
        hitMod: -4,
        dmgMod: 4,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    limb: {
        id: "limb",
        label: "Limb",
        hitMod: -2,
        dmgMod: 0,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    hand: {
        id: "hand",
        label: "Hand",
        hitMod: -4,
        dmgMod: 0,
        bypassWorn: false,
        bypassNatural: false,
        toughnessOverride: null
    },
    gap: {
        id: "gap",
        label: "Unarmored gap",
        hitMod: -4,
        dmgMod: 0,
        bypassWorn: true,
        bypassNatural: false,
        toughnessOverride: null
    }
};

// ==========================================
// CALLED SHOT ANATOMY CONFIG (per-target)
// ==========================================
// Each threat template (and deployed participant) may carry a
// `calledShotConfig` describing which called-shot locations make sense for its
// anatomy (e.g. a Barnacle has no Hand; an unarmored Zombie has no Gap), plus
// custom hit/dmg/toughness and on-hit effects for each location. This is a
// property of the TARGET: when any attacker (player or GM) targets it, the
// Called Shot dropdown is filtered by this config and the chosen location's
// values/effects come from here. Weak Point (vs Natural Armor) is handled by
// the separate weakPoint system and always takes precedence — it is NOT part
// of this anatomy config.
const CS_CONFIG_DEFAULTS = {
    head: { enabled: true,  hitPenalty: -4, dmgMod: 4,  toughnessOverride: null, onHit: [] },
    limb: { enabled: true,  hitPenalty: -2, dmgMod: 0,  toughnessOverride: null, onHit: [] },
    hand: { enabled: true,  hitPenalty: -4, dmgMod: 0,  toughnessOverride: null, onHit: ["disarm"] },
    gap:  { enabled: true,  hitPenalty: -4, dmgMod: 0,  toughnessOverride: null, onHit: [] }
};
const CS_ONHIT_OPTIONS = ["shaken", "stunned", "distracted", "vulnerable", "disarm"];

function normalizeCsConfig(cfg) {
    const base = JSON.parse(JSON.stringify(CS_CONFIG_DEFAULTS));
    if (!cfg || typeof cfg !== "object") return base;
    for (const k of Object.keys(base)) {
        if (!cfg[k] || typeof cfg[k] !== "object") continue;
        if (cfg[k].enabled !== undefined) base[k].enabled = !!cfg[k].enabled;
        if (cfg[k].hitPenalty !== undefined && cfg[k].hitPenalty !== null && cfg[k].hitPenalty !== "")
            base[k].hitPenalty = parseInt(cfg[k].hitPenalty);
        if (cfg[k].hitPenalty === undefined || cfg[k].hitPenalty === null) base[k].hitPenalty = CS_CONFIG_DEFAULTS[k].hitPenalty;
        if (cfg[k].dmgMod !== undefined && cfg[k].dmgMod !== null && cfg[k].dmgMod !== "")
            base[k].dmgMod = parseInt(cfg[k].dmgMod);
        if (cfg[k].dmgMod === undefined || cfg[k].dmgMod === null) base[k].dmgMod = CS_CONFIG_DEFAULTS[k].dmgMod;
        if (cfg[k].toughnessOverride !== undefined && cfg[k].toughnessOverride !== null && cfg[k].toughnessOverride !== "")
            base[k].toughnessOverride = parseInt(cfg[k].toughnessOverride);
        if (Array.isArray(cfg[k].onHit)) {
            base[k].onHit = cfg[k].onHit.filter(x => CS_ONHIT_OPTIONS.includes(x));
        }
    }
    return base;
}

// Returns the per-location config (with custom values + onHit) for a TARGET.
// `value` is the dropdown option id. Weak Point always takes precedence.
function getCalledShotConfig(value, target) {
    // Weak Point (vs Natural Armor) — separate system, always takes precedence.
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
            notes: wp.notes || "",
            onHit: []
        };
    }

    // Standard locations — gated & customized by the TARGET's anatomy config.
    const cfg = normalizeCsConfig(target ? target.calledShotConfig : null);
    const entry = cfg[value];
    if (!entry || !entry.enabled) {
        return { id: "none", hitMod: 0, dmgMod: 0, onHit: [] };
    }
    const base = CALLED_SHOTS[value] || { id: value, label: value, bypassWorn: false, bypassNatural: false };
    return {
        id: value,
        label: base.label || value,
        hitMod: entry.hitPenalty,
        dmgMod: entry.dmgMod,
        bypassWorn: !!base.bypassWorn,
        bypassNatural: !!base.bypassNatural,
        toughnessOverride: entry.toughnessOverride,
        onHit: entry.onHit || []
    };
}

// Build the Called Shot dropdown from the TARGET's anatomy config, plus its
// weak point (if enabled). Shared by both the player T.E.M. (character.html)
// and the GM T.E.M. (threats.html).
function populateCalledShotSelect(selectEl, target) {
    if (!selectEl) return;

    const oldValue = selectEl.value || "none";
    const cfg = normalizeCsConfig(target ? target.calledShotConfig : null);

    selectEl.innerHTML = `<option value="none">None</option>`;
    // "Unarmored gap" only matters when the target actually has worn armor
    // (AP) to bypass — hide it for targets with 0 worn armor.
    const wornArmor = target ? (parseInt(target.wornArmor) || 0) : 0;
    const order = ["head", "limb", "hand", "gap"];
    for (const k of order) {
        const entry = cfg[k];
        if (!entry || !entry.enabled) continue;
        if (k === "gap" && wornArmor <= 0) continue;
        const c = getCalledShotConfig(k, target);
        let lbl = c.label;
        if (c.dmgMod) lbl += ` (+${c.dmgMod} dmg)`;
        lbl += ` (${c.hitMod} hit)`;
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = lbl;
        selectEl.appendChild(opt);
    }

    // Weak Point (vs Natural Armor) — always available when the target has one
    // enabled; takes precedence over the anatomy config.
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

    // Preserve selection if still valid; otherwise reset to None.
    let newValue = oldValue;
    const validValues = Array.from(selectEl.options).map(o => o.value);
    if (!validValues.includes(newValue)) newValue = "none";
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
            bp = Math.floor((parseInt(secondary.ballisticProtection) || 0) / 2);
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
window.CS_CONFIG_DEFAULTS = CS_CONFIG_DEFAULTS;
window.CS_ONHIT_OPTIONS = CS_ONHIT_OPTIONS;
window.normalizeCsConfig = normalizeCsConfig;
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

// ==========================================
// SHARED TACTICAL ENGAGEMENT MONITOR (TEM)
// A single source of truth for the common situational combat modifiers,
// rendered identically on the player character sheet and the GM tracker.
// Each page passes a unique `prefix` so the input IDs don't collide.
// ==========================================

// SWADE Injury Table (Core Rulebook, 2d6). Rolled when a character is Incapacitated
// (or via the GM "ROLL INJURY" button). Guts and Head entries have a sub-roll.
const SWADE_INJURY_TABLE = [
    { roll: 2,  location: "Cosmetic", effect: "A purely cosmetic injury." },
    { roll: 3,  location: "Arm",      effect: "The victim can no longer use his left or right arm (rolled randomly if not targeted)." },
    { roll: 4,  location: "Arm",      effect: "The victim can no longer use his left or right arm (rolled randomly if not targeted)." },
    { roll: 5,  location: "Guts",     effect: "Your hero catches one in the core.", subRoll: true },
    { roll: 6,  location: "Guts",     effect: "Your hero catches one in the core.", subRoll: true },
    { roll: 7,  location: "Guts",     effect: "Your hero catches one in the core.", subRoll: true },
    { roll: 8,  location: "Guts",     effect: "Your hero catches one in the core.", subRoll: true },
    { roll: 9,  location: "Guts",     effect: "Your hero catches one in the core.", subRoll: true },
    { roll: 10, location: "Leg",      effect: "Gain the Slow Hindrance (Minor), or Major if already Slow or injured in either leg." },
    { roll: 11, location: "Leg",      effect: "Gain the Slow Hindrance (Minor), or Major if already Slow or injured in either leg." },
    { roll: 12, location: "Head",     effect: "A grievous injury to the head.", subRoll: true }
];

// Guts sub-roll (1d6): 1-2 Broken (Agility), 3-4 Battered (Vigor), 5-6 Busted (Strength).
const GUTS_SUB_TABLE = [
    { range: [1, 2], label: "Broken",  effect: "Agility reduced a die type (minimum d4)." },
    { range: [3, 4], label: "Battered", effect: "Vigor reduced a die type (minimum d4)." },
    { range: [5, 6], label: "Busted",  effect: "Strength reduced a die type (minimum d4)." }
];

// Head sub-roll (1d6): 1-3 Hideous Scar (Ugly Major), 4-5 Blinded (One Eye), 6 Brain Damage (Smarts).
const HEAD_SUB_TABLE = [
    { range: [1, 3], label: "Hideous Scar", effect: "Your hero now has the Ugly (Major) Hindrance." },
    { range: [4, 5], label: "Blinded",      effect: "An eye is damaged. Gain the One Eye Hindrance (or Blind if he only had one good eye)." },
    { range: [6, 6], label: "Brain Damage", effect: "Massive trauma to the head. Smarts reduced one die type (min d4)." }
];


// Build the HTML for the shared situational modifier panel.
// `prefix` is e.g. "tn" (player TN modal) or "calc" (GM calculator).
function buildTEMModifiersHTML(prefix) {
    const p = prefix;
    return `
    <div id="${p}-tem-section" class="tem-shared-section" style="border-top: 1px dashed var(--theme-color); padding-top: 10px;">
        <div style="font-size:0.9em; margin-bottom:8px; opacity:0.9;">SITUATIONAL MODIFIERS:</div>
        <div class="setting-row" style="margin-bottom:8px;">
            <span>Cover (target):</span>
            <select id="${p}-sit-cover" class="admin-input" style="width:170px; pointer-events: auto !important;" onchange="window.__temChanged('${p}')">
                <option value="0">None</option>
                <option value="-2">Light Cover (-2)</option>
                <option value="-4">Medium Cover (-4)</option>
                <option value="-6">Heavy Cover (-6)</option>
                <option value="-8">Full Cover (-8)</option>
            </select>
        </div>
        <div class="setting-row" style="margin-bottom:8px;">
            <span>Gang Up:</span>
            <div style="display:flex; align-items:center; gap:6px; margin-left:auto;">
                <input type="number" id="${p}-sit-gangup" class="admin-input" value="0" min="0" max="4"
                    style="width:60px; text-align:right; pointer-events: auto !important;" onchange="window.__temChanged('${p}')"
                    title="+1 per adjacent ally">
            </div>
        </div>
        <div class="setting-row" style="margin-bottom:8px;">
            <span>The Drop:</span>
            <label style="font-size: 0.9em; display:flex; align-items:center; gap:5px; pointer-events: auto !important;">
                <input type="checkbox" id="${p}-sit-drop" onchange="window.__temChanged('${p}')" style="width:20px; height:20px; pointer-events: auto !important;"> The Drop (+4 hit, +4 dmg)
            </label>
        </div>
        <div class="setting-row" style="margin-bottom:8px;">
            <span>Illumination:</span>
            <select id="${p}-sit-illum" class="admin-input" style="width:170px; pointer-events: auto !important;" onchange="window.__temChanged('${p}')">
                <option value="0">Bright (no penalty)</option>
                <option value="-2">Dim Light (-2)</option>
                <option value="-4">Dark (-4)</option>
                <option value="-6">Pitch Black (-6)</option>
            </select>
        </div>
        <div class="setting-row" style="margin-bottom:8px;">
            <span>Target Defending:</span>
            <label style="font-size: 0.9em; display:flex; align-items:center; gap:5px; pointer-events: auto !important;">
                <input type="checkbox" id="${p}-sit-defend" onchange="window.__temChanged('${p}')" style="width:20px; height:20px; pointer-events: auto !important;"> Target Defending (+4 Parry, melee only)
            </label>
        </div>
        <div class="setting-row" style="margin-bottom:8px;">
            <span>Running this turn:</span>
            <label style="font-size: 0.9em; display:flex; align-items:center; gap:5px; pointer-events: auto !important;">
                <input type="checkbox" id="${p}-sit-running" onchange="window.__temChanged('${p}')" style="width:20px; height:20px; pointer-events: auto !important;">
                <span id="${p}-running-penalty-label">-2 to this roll</span>
            </label>
        </div>
    </div>`;
}

// Read the shared TEM values from the DOM. Returns { total, summary, values }.
// `isMelee` controls whether the Defend modifier applies (melee only).
// `steadyHands` makes the running penalty -1 instead of -2.
function getTEMModifierValues(prefix, opts) {
    opts = opts || {};
    const isMelee = !!opts.isMelee;
    const steadyHands = !!opts.steadyHands;
    let total = 0;
    const summary = [];
    const values = {};
    const get = (id) => document.getElementById(prefix + '-' + id);

    let coverEl = get('sit-cover');
    if (coverEl) {
        values.cover = parseInt(coverEl.value) || 0;
        if (values.cover !== 0) {
            total += values.cover;
            const txt = coverEl.options[coverEl.selectedIndex].text;
            summary.push(txt);
        }
    }
    let gangEl = get('sit-gangup');
    if (gangEl) {
        let g = Math.min(4, Math.max(0, parseInt(gangEl.value) || 0));
        values.gangUp = g;
        if (g > 0) { total += g; summary.push(`Gang Up +${g}`); }
    }
    let dropEl = get('sit-drop');
    if (dropEl) {
        values.drop = dropEl.checked;
        if (dropEl.checked) { total += 4; summary.push('The Drop +4'); }
    }
    let illumEl = get('sit-illum');
    if (illumEl) {
        values.illum = parseInt(illumEl.value) || 0;
        if (values.illum !== 0) {
            total += values.illum;
            const txt = illumEl.options[illumEl.selectedIndex].text;
            summary.push(txt);
        }
    }
    let defendEl = get('sit-defend');
    if (defendEl) {
        values.defend = defendEl.checked;
        // Defend = TARGET defending, +4 Parry, MELEE ONLY. NOT added to the roll total
        // here — the caller applies it (player: -4 to roll; GM calc: +4 to Parry) to
        // avoid double-counting.
        if (defendEl.checked && isMelee) { summary.push('Target Defending (+4 Parry, melee)'); }
    }
    let runEl = get('sit-running');
    if (runEl) {
        values.running = runEl.checked;
        if (runEl.checked) {
            const pen = steadyHands ? -1 : -2;
            total += pen;
            summary.push(`Running ${pen}`);
        }
    }
    return { total, summary, values };
}

// Reset all shared TEM controls to their defaults.
function resetTEMModifiers(prefix) {
    const set = (id, val) => { const el = document.getElementById(prefix + '-' + id); if (el) { if (el.type === 'checkbox') el.checked = val; else el.value = val; } };
    set('sit-cover', '0');
    set('sit-gangup', '0');
    set('sit-drop', false);
    set('sit-illum', '0');
    set('sit-defend', false);
    set('sit-running', false);
}

// Build a compact "Active Modifiers" line for Discord embeds from a summary array
// plus any extra page-specific modifiers (range, rof, map, wild attack, called shot, etc.)
function temSummaryToField(extras) {
    const lines = [];
    if (extras && Array.isArray(extras)) {
        for (const e of extras) { if (e) lines.push(e); }
    }
    return lines.length ? lines.join('\n') : 'None (all defaults)';
}

// Format a millisecond countdown as MM:SS for Discord.
function formatCountdown(ms) {
    if (ms <= 0) return '00:00';
    let totalSec = Math.floor(ms / 1000);
    let m = Math.floor(totalSec / 60);
    let s = totalSec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Default no-op so onchange handlers don't break before a page wires them up.
window.__temChanged = window.__temChanged || function () { };

// Roll on the SWADE Injury Table (2d6). Guts (5-9) and Head (12) entries have a
// 1d6 sub-roll. Returns { roll, location, effect, sub, subRoll }.
function rollInjuryTable() {
    const r = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
    let entry = SWADE_INJURY_TABLE.find(e => e.roll === r);
    if (!entry) {
        // 3 and 4 share the Arm entry; 10 and 11 share Leg. Find by range.
        entry = SWADE_INJURY_TABLE.find(e => e.roll === r) || SWADE_INJURY_TABLE[0];
    }
    let result = { roll: r, location: entry.location, effect: entry.effect, sub: null, subRoll: null };
    if (entry.subRoll) {
        const sub = Math.floor(Math.random() * 6) + 1;
        let table = (entry.location === 'Guts') ? GUTS_SUB_TABLE : HEAD_SUB_TABLE;
        let match = table.find(e => sub >= e.range[0] && sub <= e.range[1]);
        if (match) {
            result.subRoll = sub;
            result.sub = match.label;
            result.effect = match.effect;
            result.location = `${entry.location} (${match.label})`;
        }
    }
    return result;
}
window.rollInjuryTable = rollInjuryTable;
window.SWADE_INJURY_TABLE = SWADE_INJURY_TABLE;
window.GUTS_SUB_TABLE = GUTS_SUB_TABLE;
window.HEAD_SUB_TABLE = HEAD_SUB_TABLE;

window.buildTEMModifiersHTML = buildTEMModifiersHTML;
window.getTEMModifierValues = getTEMModifierValues;
window.resetTEMModifiers = resetTEMModifiers;
window.temSummaryToField = temSummaryToField;
window.formatCountdown = formatCountdown;



// --- Validation warnings for threat editor ---
function validateThreatTemplate(t) {
    const warnings = [];
    if (!t) return warnings;

    // Check Toughness vs expected
    if (t.weakPoint?.toughnessOverride !== null && t.weakPoint?.toughnessOverride !== undefined) {
        // Skip Toughness warning if GM intentionally hardcoded an override
    } else {
        const vigorStr = (t.attributes && t.attributes.Vigor) ? String(t.attributes.Vigor) : "d6";
        const vigorMatch = vigorStr.match(/d(\d+)/);
        const vigorDie = vigorMatch ? parseInt(vigorMatch[1]) : 6;
        const totalArmor = (parseInt(t.naturalArmor) || 0) + (parseInt(t.wornArmor) || 0) + (parseInt(t.forceField) || 0);
        const scale = parseInt(t.scale) || 0;
        const expectedToughness = 2 + Math.floor(vigorDie / 2) + totalArmor + scale;
        const actualToughness = parseInt(t.toughness) || 0;
        if (actualToughness !== expectedToughness) {
            warnings.push(`\u26a0 Toughness (${actualToughness}) \u2260 expected ${expectedToughness} (2 + Vig ${vigorDie}/2 + Armor ${totalArmor} + Scale ${scale}).`);
        }
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

// ==========================================
// AREA EFFECT (blast / cone / line) — shared by character.html & threats.html
// ==========================================
// Canonical table consulted when a weapon carries no explicit areaEffect flag,
// so existing Firebase presets / deployed threats work WITHOUT a destructive
// migration. An explicit flag on the weapon object always wins, which is how a
// GM will later tag custom weapons (editor UI for that is a small follow‑up,
// not part of Phase 1).
const AREA_EFFECT_TABLE = {           // keyed by weapon id
    'grenade': { kind: 'thrown',  template: 'SBT' },
    'mine':    { kind: 'contact', template: 'SBT' },
    'rpg':     { kind: 'fired',   template: 'MBT' },
    'ar2-orb': { kind: 'fired',   template: 'MBT' }
};
const AREA_EFFECT_BY_NAME = {         // keyed by lower‑cased weapon name
    'frag grenade':   { kind: 'thrown',  template: 'SBT' },
    'slam mine':      { kind: 'contact', template: 'SBT' },
    'rpg launcher':   { kind: 'fired',   template: 'MBT' },
    'ar2 energy orb': { kind: 'fired',   template: 'MBT' },
    'warp cannon':    { kind: 'line',    template: 'Line' }
};
const AREA_KIND_DEFAULT_TEMPLATE = {
    thrown: 'SBT', contact: 'SBT', fired: 'MBT', cone: 'Cone', line: 'Line'
};
// Deviation base dice per kind (documented + stored now; rolled in Phase 3).
// null = this kind does NOT deviate (contact / cone / line, per Q‑H).
const AREA_DEVIATION = {
    thrown:  { dice: '1d6' },
    fired:   { dice: '2d6' },
    contact: { dice: null },
    cone:    { dice: null },
    line:    { dice: null }
};
// Resolve a weapon to its area‑effect descriptor, or null if it isn't one.
function getAreaEffectInfo(weapon) {
    if (!weapon) return null;
    // 1) Explicit override on the weapon object.
    if (weapon.areaEffect === true) {
        const kind = weapon.areaKind || 'fired';
        return {
            isArea: true,
            kind: kind,
            defaultTemplate: weapon.areaTemplate || AREA_KIND_DEFAULT_TEMPLATE[kind] || 'SBT',
            deviation: AREA_DEVIATION[kind] || null
        };
    }
    if (weapon.areaEffect === false) return null;   // explicitly NOT area
    // 2) Legacy / untagged: canonical table by id, then by name.
    let entry = null;
    if (weapon.id && AREA_EFFECT_TABLE[weapon.id]) entry = AREA_EFFECT_TABLE[weapon.id];
    if (!entry && weapon.name) {
        const nm = String(weapon.name).trim().toLowerCase();
        if (AREA_EFFECT_BY_NAME[nm]) entry = AREA_EFFECT_BY_NAME[nm];
    }
    if (!entry) return null;
    const kind = entry.kind;
    return {
        isArea: true,
        kind: kind,
        defaultTemplate: entry.template || AREA_KIND_DEFAULT_TEMPLATE[kind] || 'SBT',
        deviation: AREA_DEVIATION[kind] || null
    };
}
// Read the template size the player/GM picked in the area banner (Phase 2+).
function getAreaTemplateChoice() {
    const s = document.getElementById('area-template-select');
    return s ? s.value : null;
}
// Re‑skin the attack modal for (or out of) AREA MODE. Owns ALL show/hide
// decisions for area vs single‑target so the two modes can never leak into
// each other across consecutive opens. `isArea` false fully restores the
// single‑target layout (prepareRoll/prepareAttack own called‑shot / RoF /
// wild‑attack visibility for the non‑area case, so we leave those alone then).
function applyAreaModeUI(isArea, areaInfo) {
    const $ = (id) => document.getElementById(id);
    const banner   = $('area-effect-banner');
    const singleRow = $('single-target-row');
    const multiRow  = $('multi-target-row');
    const statusEl  = $('target-status');
    const previewEl = $('effective-toughness-preview');
    const dodgeRow  = $('target-dodge-row');
    const csRow     = $('called-shot-row');
    const csStatus  = $('called-shot-status');
    const csSel     = $('called-shot-select');
    const rofCont   = $('rof-options-container');
    const wildRow   = $('wild-attack-row');
    const rangeRow  = $('range-select') ? $('range-select').closest('.setting-row') : null;
    const tnInput   = $('tn-input');
    const targetSel = $('target-select');

    // Banner + target‑list swap.
    if (banner)    banner.style.display    = isArea ? 'block' : 'none';
    if (singleRow) singleRow.style.display = isArea ? 'none'  : 'flex';
    if (multiRow)  multiRow.style.display  = isArea ? 'flex'  : 'none';
    if (statusEl)  statusEl.style.display  = isArea ? 'none'  : '';
    // Action Type (Test/Support) targets a PERSON, not a location. In AREA MODE
    // a stray "Perform Test" would roll the weapon skill vs TN 4 and then
    // silently discard the chosen effect (no single target) — a confusing no‑op.
    // Hide the whole row + force Normal; non‑area restores it (onActionModeChange
    // still owns the Test sub‑row once the user re‑enables it).
    const actionRow = $('action-mode-row');
    const actionSel = $('action-mode-select');
    const testRow   = $('test-options-row');
    if (actionRow) actionRow.style.display = isArea ? 'none' : '';
    if (testRow)   testRow.style.display   = 'none';
    if (actionSel) actionSel.value         = 'normal';
    // Preview is per‑target; always hidden on open (onTargetChange re‑shows it
    // for a chosen target when non‑area). Dodge is per‑target too.
    if (previewEl) previewEl.style.display = 'none';
    if (dodgeRow)  dodgeRow.style.display  = 'none';

    // Area weapons never use Called Shots, RoF / fire‑modes, or Wild Attack.
    if (isArea) {
        if (csRow)    csRow.style.display    = 'none';
        if (csStatus) csStatus.style.display = 'none';
        if (csSel)    csSel.value = 'none';          // no stale called shot
        if (rofCont)  rofCont.style.display  = 'none';
        if (wildRow)  wildRow.style.display  = 'none';
        if (targetSel) targetSel.value = '';         // no stale single target
    }
    // Range bracket only matters for thrown / fired (range penalty AND the
    // Phase‑3 deviation multiplier). Cone / line have a fixed reach; contact
    // is adjacent — for those we hide the bracket row but keep Aiming (Q‑C).
    const kind = areaInfo ? areaInfo.kind : null;
    const needsRangeBracket = isArea && (kind === 'thrown' || kind === 'fired');
    if (rangeRow) rangeRow.style.display = (isArea && !needsRangeBracket) ? 'none' : '';

    // Per‑target TEM rows (Cover / Gang Up / Defend) are meaningless vs a point.
    // Illumination, The Drop and Running stay (attacker‑side, Q‑B).
    ['sit-cover', 'sit-gangup', 'sit-defend'].forEach((sfx) => {
        const ctrl = $('tn-' + sfx);
        const row = ctrl ? ctrl.closest('.setting-row') : null;
        if (row) row.style.display = isArea ? 'none' : '';
    });

    // Default the template dropdown + force the attack to TN 4 (a location).
    if (isArea) {
        const tSel = $('area-template-select');
        if (tSel && areaInfo) tSel.value = areaInfo.defaultTemplate || 'SBT';
        if (tnInput) tnInput.value = '4';
    }
}
window.AREA_EFFECT_TABLE = AREA_EFFECT_TABLE;
window.AREA_EFFECT_BY_NAME = AREA_EFFECT_BY_NAME;
window.AREA_KIND_DEFAULT_TEMPLATE = AREA_KIND_DEFAULT_TEMPLATE;
window.AREA_DEVIATION = AREA_DEVIATION;
window.getAreaEffectInfo = getAreaEffectInfo;
window.getAreaTemplateChoice = getAreaTemplateChoice;
window.applyAreaModeUI = applyAreaModeUI;

// ==========================================
// AREA ATTACK PLAN — built once at CONFIRM, read by the attack embed (Phase 2),
// deviation (Phase 3) and per‑target damage (Phase 4). The ctrl‑click list's
// only job is to populate this at Confirm; afterwards the live multi‑select is
// irrelevant (no selection drift, no key collisions).
// ==========================================
// Parse the distance (in inches) to the aimed point for a chosen range bracket.
// The weapon's range string holds Short/Medium/Long (e.g. "36/72/144", or
// "Throw 6/12/18"); bracketIndex 0..3 = Short/Medium/Long/Extreme. Extreme has
// no 4th number in the string, so we extrapolate 2× the longest listed bracket.
// "Contact"/"Melee" have no numbers → 0 (deviation is N/A for those anyway).
function parseAreaRangeDistance(rangeStr, bracketIndex) {
    const nums = (String(rangeStr || '').match(/\d+/g) || [])
        .map(n => parseInt(n, 10)).filter(n => !isNaN(n));
    if (!nums.length) return 0;
    if (nums[bracketIndex] !== undefined) return nums[bracketIndex];
    return nums[nums.length - 1] * 2;   // Extreme / beyond‑listed extrapolation
}
// Build the plan from the live modal controls + the combatant list. Reads the
// shared DOM ids (multi‑target‑select / range‑select / area‑template‑select),
// which are identical on character.html and threats.html.
function buildAreaAttackPlan(areaInfo, weaponObj, attackerName, participants, round) {
    const $ = (id) => document.getElementById(id);
    const kind = areaInfo ? areaInfo.kind : 'fired';
    // Template choice (display + recorded; size drives no math).
    const tSel = $('area-template-select');
    let templateValue = null, templateLabel = '';
    if (tSel) {
        templateValue = tSel.value;
        templateLabel = (tSel.options[tSel.selectedIndex] || {}).text || tSel.value;
    }
    // Range bracket + parsed distance (the distance is what Phase 3 needs).
    const rSel = $('range-select');
    const rangeBracketValue = rSel ? rSel.value : '0';
    const rangeBracketLabel = (rSel && rSel.options[rSel.selectedIndex])
        ? rSel.options[rSel.selectedIndex].text : 'Short Range (+0)';
    const bracketIndex = rangeBracketValue === '-2' ? 1
        : rangeBracketValue === '-4' ? 2 : rangeBracketValue === '-8' ? 3 : 0;
    const distanceNumber = parseAreaRangeDistance(weaponObj ? weaponObj.range : '', bracketIndex);
    // Phrasing that reads naturally for every kind. thrown/fired cite the range
    // bracket + parsed distance; cone/line/contact cite a *reach* (never the raw
    // "48 Line" string, which produced "placed at Reach 48 Line").
    let rangeOrReachLabel;
    if (kind === 'thrown' || kind === 'fired') {
        rangeOrReachLabel = `${rangeBracketLabel} · ~${distanceNumber}" to point`;
    } else {
        const rng = weaponObj ? (weaponObj.range || '') : '';
        const reachNum = (rng.match(/\d+/) || [])[0];
        rangeOrReachLabel = reachNum ? `reach ${reachNum}"` : `reach: ${rng || '—'}`;
    }
    // Intended targets from the Ctrl‑click list (with read‑only Tgh/Armor).
    const mSel = $('multi-target-select');
    const targets = [];
    if (mSel) {
        Array.from(mSel.selectedOptions).forEach(o => {
            const p = (participants || []).find(x => x.id === o.value);
            targets.push({
                id: o.value,
                name: p ? p.name : (o.textContent || o.value),
                tgh: p ? (parseInt(p.toughness) || 0) : 0,
                armor: p ? (parseInt(p.armor) || 0) : 0
            });
        });
    }
    return {
        attackerName: attackerName || 'Attacker',
        weaponName: weaponObj ? (weaponObj.name || 'Weapon') : 'Weapon',
        ap: weaponObj ? (weaponObj.ap ?? '0') : '0',
        round: (round === undefined || round === null) ? null : round,
        savedAt: Date.now(),
        areaKind: kind,
        templateValue: templateValue,
        templateLabel: templateLabel || (areaInfo ? areaInfo.defaultTemplate : 'SBT'),
        rangeBracketValue: rangeBracketValue,
        rangeBracketLabel: rangeBracketLabel,
        distanceNumber: distanceNumber,
        rangeOrReachLabel: rangeOrReachLabel,
        targets: targets,
        calledShotDisabled: true
    };
}
// sessionStorage mirror so a reload mid‑combat doesn't lose the plan (the page
// also keeps it in a module var for the immediate embed/damage step).
const AREA_PLAN_PREFIX = 'area_attack_plan_';
function setAreaAttackPlan(key, plan) { if (key) sessionStorage.setItem(AREA_PLAN_PREFIX + key, JSON.stringify(plan)); }
function getAreaAttackPlan(key) { if (!key) return null; try { return JSON.parse(sessionStorage.getItem(AREA_PLAN_PREFIX + key)) || null; } catch (e) { return null; } }
function clearAreaAttackPlan(key) { if (key) sessionStorage.removeItem(AREA_PLAN_PREFIX + key); }
function clearAllAreaPlans() {
    Object.keys(sessionStorage).filter(k => k.startsWith(AREA_PLAN_PREFIX)).forEach(k => sessionStorage.removeItem(k));
}
window.parseAreaRangeDistance = parseAreaRangeDistance;
window.buildAreaAttackPlan = buildAreaAttackPlan;
window.setAreaAttackPlan = setAreaAttackPlan;
window.getAreaAttackPlan = getAreaAttackPlan;
window.clearAreaAttackPlan = clearAreaAttackPlan;
window.clearAllAreaPlans = clearAllAreaPlans;
// ==========================================
// CUSTOM AREA TARGET LIST — replaces the native <select multiple> UX.
// A native multi-select loses its *visible* selection the moment focus moves to
// another control (Range Bracket, TEM, Aiming…), which read as "it deselected my
// targets". Here each target is a <div> row whose selected state is a CSS class,
// so it is focus‑independent and persists across the whole modal. The hidden
// native <select multiple> is kept in sync on every toggle, so buildAreaAttackPlan
// and the damage step keep reading selectedOptions unchanged.
// ==========================================
function setupAreaTargetList() {
    const list = document.getElementById('multi-target-list');
    if (!list || list.__areaWired) return;
    list.__areaWired = true;
    list.addEventListener('click', function (e) {
        const row = e.target.closest('.area-target-row');
        if (!row) return;
        const id = row.dataset.id;
        const sel = document.getElementById('multi-target-select');
        if (!sel) return;
        const opt = Array.from(sel.options).find(o => o.value === id);
        if (!opt) return;
        opt.selected = !opt.selected;                 // keep the hidden select in sync
        row.classList.toggle('area-target-selected', opt.selected);
    });
}
window.setupAreaTargetList = setupAreaTargetList;
// settings.js loads after the modal markup on every page that has the list; pages
// without it no-op via the guard above (tracker, dashboard, etc.).
setupAreaTargetList();
