// ==========================================
// embeds.js — SINGLE SOURCE OF TRUTH for Discord embeds
// ------------------------------------------
// Every Discord embed the site posts is built and sent from this file.
// To change formatting, add a new embed, or tweak fields, edit HERE only.
// Pages call window.Embeds.<name>(...) and never build fetch/embed objects inline.
// ==========================================
(function () {
    'use strict';

    // ---- low-level posting helpers ----

    // Post a single embed (fire-and-forget). No-op if no webhook.
    async function post(webhook, embed) {
        if (!webhook) return;
        try {
            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        } catch (e) { /* webhook failures are non-fatal */ }
    }

    // Post an embed and return its Discord message ID (for later deletion).
    async function postTracked(webhook, embed) {
        if (!webhook) return null;
        try {
            const url = webhook.includes('wait=true') ? webhook : (webhook.includes('?') ? `${webhook}&wait=true` : `${webhook}?wait=true`);
            const resp = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            if (!resp.ok) return null;
            const data = await resp.json();
            return (data && data.id) ? data.id : null;
        } catch (e) { return null; }
    }

    // Delete a previously-posted webhook message (by message ID).
    async function deleteMessage(webhook, messageId) {
        if (!webhook || !messageId) return;
        try {
            const m = webhook.match(/webhooks\/(\d+)\/([A-Za-z0-9_-]+)/);
            if (!m) return;
            const [, id, token] = m;
            await fetch(`https://discord.com/api/webhooks/${id}/${token}/messages/${messageId}`, { method: 'DELETE' });
        } catch (e) { /* non-fatal */ }
    }

    // ---- common building blocks ----

    function modField(totalMod) {
        if (!totalMod) return null;
        return { name: "Modifier", value: `${totalMod > 0 ? '+' : ''}${totalMod}`, inline: true };
    }

    function traitFields(dieLabel, traitHistory, wildHistory) {
        return [
            { name: dieLabel, value: traitHistory.join(' + '), inline: true },
            { name: "Wild (d6)", value: wildHistory.join(' + '), inline: true }
        ];
    }

    // ---- embed builders ----

    // Generic trait roll (used for Spirit/Stun recovery, unshake, etc.).
    function traitRoll(title, desc, color, dieLabel, traitHistory, wildHistory, totalMod) {
        const embed = { title, description: desc, color, fields: traitFields(dieLabel, traitHistory, wildHistory) };
        const mf = modField(totalMod);
        if (mf) embed.fields.push(mf);
        return embed;
    }

    // HEAL (Healing skill) — healer treats patient's wounds.
    function heal(healerName, patientName, die, traitHistory, wildHistory, totalMod, bestTotal, healed, woundsRemaining) {
        const embed = {
            title: `${healerName} attempts Healing on ${patientName}`,
            description: `**Result: ${bestTotal}** (Healing vs TN 4)\n**Healed ${healed} Wound(s)** — ${woundsRemaining} remain.`,
            color: healed > 0 ? 0x00ff00 : 0xff3333,
            fields: traitFields(`Healing (d${die})`, traitHistory, wildHistory)
        };
        const mf = modField(totalMod);
        if (mf) embed.fields.push(mf);
        return embed;
    }

    // NATURAL HEALING (Vigor) — GM-awarded, once per 5 in-game days.
    function naturalHealing(name, vigorDie, traitHistory, wildHistory, totalMod, bestTotal, healed, woundsRemaining) {
        const embed = {
            title: `${name} — Natural Healing`,
            description: `**Result: ${bestTotal}** (Vigor vs TN 4)\n${healed > 0 ? `**Healed ${healed} Wound(s)** — ${woundsRemaining} remain.` : '**FAILURE** — no wounds healed.'}`,
            color: healed > 0 ? 0x00ff00 : 0xff3333,
            fields: traitFields(`Vigor (d${vigorDie})`, traitHistory, wildHistory)
        };
        const mf = modField(totalMod);
        if (mf) embed.fields.push(mf);
        return embed;
    }

    // SOAK (Vigor, spend a benny).
    function soak(name, vigorDie, traitHistory, wildHistory, totalMod, bestTotal, removed, allSoaked) {
        const embed = {
            title: `${name} spent a Benny to Soak`,
            description: `**Result: ${bestTotal}** (Vigor vs TN 4)\n**Soaked ${removed} Wound(s)** — removed from the target${allSoaked ? " (Shaken cleared)" : ""}.`,
            color: removed > 0 ? 0x00ff00 : 0xff3333,
            fields: traitFields(`Vigor (d${vigorDie})`, traitHistory, wildHistory)
        };
        const mf = modField(totalMod);
        if (mf) embed.fields.push(mf);
        return embed;
    }

    // UNSHAKE with a benny (no roll).
    function unshake(name) {
        return {
            title: `${name} spent a Benny to Unshake`,
            description: `Removed **SHAKEN** instantly (no roll). May act normally.`,
            color: 0xffff00
        };
    }

    // Wound applied (auto-damage or GM). Includes Golden Hour expiry timestamp.
    function woundTaken(name, woundsAdded, totalWounds, attackerName, incapacitated) {
        const ghExpiry = `<t:${Math.floor(Date.now() / 1000) + 3600}:t>`;
        return {
            title: `Wound taken: ${name}`,
            description: `**${woundsAdded} wound(s)** applied${attackerName ? ` by ${attackerName}` : ''}.\nTotal wounds: **${totalWounds}**${incapacitated ? '\n**INCAPACITATED**' : ''}`,
            color: 0xff3333,
            fields: [
                { name: "Golden Hour expires", value: ghExpiry, inline: true }
            ]
        };
    }

    // Fatigue gained (GM). Includes hourly recovery timestamp.
    function fatigueGained(name, totalFatigue, incapacitated) {
        const recExpiry = `<t:${Math.floor(Date.now() / 1000) + 3600}:t>`;
        return {
            title: `Fatigue gained: ${name}`,
            description: `**1 fatigue level** added by the GM.\nTotal fatigue: **${totalFatigue}**${incapacitated ? '\n**INCAPACITATED**' : ''}`,
            color: 0xff9900,
            fields: [
                { name: "Recovers 1 level at", value: recExpiry, inline: true }
            ]
        };
    }

    // Injury sustained (GM roll or incap roll).
    function injurySustained(name, roll, location, description, sub) {
        const fields = [{ name: "Sustained", value: `<t:${Math.floor(Date.now() / 1000)}:f>`, inline: true }];
        if (sub) fields.push({ name: "Detail", value: sub, inline: true });
        return {
            title: `Injury sustained: ${name}`,
            description: `**${location}** (rolled ${roll} on the Injury Table)\n${description}`,
            color: 0xff0055,
            fields
        };
    }

    // Incapacitation Soak (benny).
    function incapSoak(name, vigorDie, traitHistory, wildHistory, bestTotal, soaked, stillIncap) {
        return {
            title: `${name} — Incapacitation Soak`,
            description: `**Result: ${bestTotal}** (Vigor vs TN 4)\n${soaked > 0 ? `Soaked ${soaked} wound(s). ${stillIncap ? 'Still Incapacitated.' : 'Back in the fight!'}` : 'Failed — no wounds removed.'}`,
            color: soaked > 0 ? 0x00ff00 : 0xff3333,
            fields: traitFields(`Vigor (d${vigorDie})`, traitHistory, wildHistory)
        };
    }

    // Incapacitation Roll (Vigor vs TN 4 → death/injury/bleeding).
    function incapRoll(name, vigorDie, traitHistory, wildHistory, bestTotal, outcome, color) {
        return {
            title: `${name} — Incapacitation Roll`,
            description: `**Result: ${bestTotal}** (Vigor vs TN 4)\n${outcome}`,
            color: color,
            fields: traitFields(`Vigor (d${vigorDie})`, traitHistory, wildHistory)
        };
    }

    // Bleeding Out roll (per-turn Vigor).
    function bleedingOut(name, vigorDie, traitHistory, wildHistory, bestTotal, stable) {
        return {
            title: `${name} — Bleeding Out Roll`,
            description: `**Result: ${bestTotal}** (Vigor vs TN 4)\n${stable ? 'Stable — bleeding stopped.' : 'FAILURE — the character has died.'}`,
            color: stable ? 0x00ff00 : 0xff3333,
            fields: traitFields(`Vigor (d${vigorDie})`, traitHistory, wildHistory)
        };
    }

    // TEM — GM calculator attack compare.
    function temAttack(targetName, roll, effectiveRoll, parry, hitText, modNotes) {
        return {
            title: `TEM — Attack vs ${targetName}`,
            description: `**Roll: ${roll}** -> effective **${effectiveRoll}** vs Parry **${parry}**\n${hitText}`,
            color: effectiveRoll >= parry ? 0x00ff00 : 0xff9900,
            fields: [
                { name: "Active Modifiers", value: modNotes.length ? modNotes.join('\n') : 'None (all defaults)', inline: false }
            ]
        };
    }

    // TEM — GM calculator damage compare.
    function temDamage(targetName, roll, effectiveToughness, output, breakdown, modNotes) {
        return {
            title: `TEM — Damage vs ${targetName}`,
            description: `**Dmg: ${roll}** vs Toughness **${effectiveToughness}**\n${output}`,
            color: 0xff9900,
            fields: [
                { name: "Breakdown", value: breakdown, inline: false },
                { name: "Active Modifiers", value: modNotes.length ? modNotes.join('\n') : 'None (all defaults)', inline: false }
            ]
        };
    }

    // Combat turn order — NO Discord emojis; incapacitated names are struck through
    // with Markdown (~~Name~~). Markers are plain ASCII (>, J>, H>).
    function turnOrder(combat, activeIdx, isJokerInterrupt, isHoldInterrupt) {
        if (!combat || !combat.participants || !combat.participants.length) return null;
        let round = combat.round || 1;
        let lines = [];
        combat.participants.forEach((p, i) => {
            let card = p.card ? (p.card.label || '—') : '(no card)';
            // Plain-ASCII turn markers (no emoji).
            let marker = '';
            if (isJokerInterrupt && i === combat.jokerActiveIndex) marker = 'J> ';
            else if (isHoldInterrupt && i === combat.holdActiveIndex) marker = 'H> ';
            else if (i === activeIdx && !isJokerInterrupt && !isHoldInterrupt) marker = '> ';
            // Strike through incapacitated/dead names instead of appending (INCAP).
            let baseName = p.name;
            let displayName = (p.incapacitated || p.dead) ? `~~${baseName}~~` : `**${baseName}**`;
            lines.push(`${marker}${displayName} — ${card} — ${participantConditions(p)}`);
        });
        let activeP = combat.participants[activeIdx];
        let currentName = activeP ? activeP.name : '—';
        return {
            title: 'Combat Turn Order',
            description: `**Round ${round}** — Current turn: **${currentName}**\n\n${lines.join('\n')}`,
            color: 0xff9900
        };
    }

    // Conditions string for a participant (used by turn-order embed + tracker).
    function participantConditions(p) {
        let conds = [];
        if (p.dead) conds.push('DEAD');
        if (p.incapacitated) conds.push('INCAPACITATED');
        if (p.bleedingOut) conds.push('BLEEDING OUT');
        if (p.bound) conds.push('Bound');
        if (p.entangled) conds.push('Entangled');
        if (p.stunned) conds.push('Stunned');
        if (p.shaken) conds.push('Shaken');
        if (p.distracted) conds.push('Distracted');
        if (p.vulnerable) conds.push('Vulnerable');
        if (p.defending) conds.push('Defending');
        if (p.onHold) conds.push('On Hold');
        let pen = Math.min(p.wounds || 0, 3) + Math.min(p.fatigue || 0, 2);
        if (!p.incapacitated && pen > 0) conds.push(`-${pen} pen`);
        if ((p.wounds || 0) > 0) conds.push(`W:${p.wounds}`);
        if ((p.fatigue || 0) > 0) conds.push(`F:${p.fatigue}`);
        return conds.length ? conds.join(', ') : 'OK';
    }

    // AREA EFFECT damage (Phase 4) — one rolled blast applied per-target with
    // individual Cover / Evasion. Carries the dice notation + per-die history
    // (like every other damage embed) plus one field per target so the table can
    // see exactly how each figure's wound count was reached.
    function areaDamage(opts) {
        opts = opts || {};
        const w = opts.weapon || {};
        const perTarget = opts.perTarget || [];
        const descLines = [perTarget.length > 0
            ? `**Damage: ${opts.total}** applied to ${perTarget.length} target(s)`
            : `**Damage rolled: ${opts.total}** (not auto-applied)`];
        if (opts.raiseRolls && opts.raiseRolls.length) descLines.push('*(Includes +1d6 Raise Bonus)*');
        if (opts.has3RB) descLines.push('*(Includes +1 Damage from 3-Round Burst)*');
        if (opts.hasDT && opts.dtVal) descLines.push(`*(Includes +${opts.dtVal} Damage from Double Tap)*`);
        if (opts.jokerBonus) descLines.push(`*(Includes +${opts.jokerBonus} Joker Bonus)*`);
        if (opts.wildAttackDmgBonus) descLines.push(`*(Includes +${opts.wildAttackDmgBonus} Wild Attack Bonus)*`);
        if (opts.calledDmg) descLines.push(`*(Includes +${opts.calledDmg} Called Shot damage)*`);
        if (opts.note) descLines.push('', opts.note);
        const fields = [];
        fields.push({ name: "Dice", value: (opts.diceHistory && opts.diceHistory.length) ? opts.diceHistory.join(' + ') : '—', inline: true });
        if (opts.modifier) fields.push({ name: "Modifier", value: `${opts.modifier > 0 ? '+' : ''}${opts.modifier}`, inline: true });
        if (opts.raiseRolls && opts.raiseRolls.length) fields.push({ name: "Raise Bonus (+1d6)", value: opts.raiseRolls.join(' + '), inline: true });
        if (opts.has3RB) fields.push({ name: "Three-Round Burst", value: "+1 Damage", inline: true });
        if (opts.hasDT && opts.dtVal) fields.push({ name: "Double Tap", value: `+${opts.dtVal} Damage`, inline: true });
        if (opts.jokerBonus) fields.push({ name: "Joker's Wild", value: `+${opts.jokerBonus}`, inline: true });
        if (opts.wildAttackDmgBonus) fields.push({ name: "Wild Attack", value: `+${opts.wildAttackDmgBonus}`, inline: true });
        if (opts.calledDmg) fields.push({ name: "Called Shot", value: `+${opts.calledDmg} Damage`, inline: true });
        fields.push({ name: "Weapon Specifications", value: `Range: ${w.range || '—'}\nDamage: ${w.damage || '—'}\nAP: ${w.ap || '0'}\nRoF: ${w.rof || '1'}`, inline: false });
        perTarget.forEach((t) => {
            const mit = `Cover −${t.coverApplied || 0}` + (t.evasion ? ' + Evasion (halved)' : '');
            const body = (t.plainText || 'No effect.').replace(/^AUTO-APPLIED:\s*/, '').replace(/^AUTO-CHECK:\s*/, '');
            fields.push({
                name: `${t.targetName} (Tgh ${t.tgh || 0}${t.armor ? '+' + t.armor : ''})`,
                value: `${mit} → eff dmg ${t.effectiveDamage}\n${body}`,
                inline: false
            });
        });
        const embed = {
            title: opts.title || `${opts.attackerName || 'Attacker'} — Area Damage: ${w.name || 'Weapon'}`,
            description: descLines.join('\n'),
            color: 0xff3333,
            fields: fields
        };
        const imgUrl = w.icon || w.image || '';
        if (imgUrl) embed.thumbnail = { url: imgUrl };
        return embed;
    }
    // ---- public API ----
    window.Embeds = {
        post,
        postTracked,
        deleteMessage,
        // builders
        traitRoll,
        heal,
        naturalHealing,
        soak,
        unshake,
        woundTaken,
        fatigueGained,
        injurySustained,
        incapSoak,
        incapRoll,
        bleedingOut,
        temAttack,
        temDamage,
        turnOrder,
        participantConditions,
        areaDamage
    };

    // Back-compat aliases (older code referenced these names on window).
    window.postWebhookEmbed = post;
    window.postWebhookEmbedTracked = postTracked;
    window.deleteWebhookMessage = deleteMessage;
})();
