import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const files = {
  character: readFileSync('character.html', 'utf8'),
  tracker: readFileSync('tracker.html', 'utf8'),
  threats: readFileSync('threats.html', 'utf8'),
  settings: readFileSync('settings.js', 'utf8'),
  breach: readFileSync('minigames/breach_system.html', 'utf8'),
};

function checkSourceInvariants() {
  for (const [name, source] of Object.entries(files)) {
    assert(!source.includes('adminview'), `${name}: URL substring admin bypass must not exist`);
  }

  for (const key of ['raise_bonus_', '3rb_bonus_', 'dt_bonus_', 'wild_attack_dmg_']) {
    assert(!files.character.includes(key), `character: stale persistent bonus key ${key} must not exist`);
  }

  assert(files.character.includes('const pendingDamagePrefix = \'pending_damage_bonus_\''), 'character: pending bonuses must be session scoped');
  assert(files.character.includes('sessionStorage.setItem(`${pendingDamagePrefix}${key}`'), 'character: pending bonuses must be stored in sessionStorage');
  assert(files.character.includes('getWeaponBonusKey(activeWeaponContext, activeWeaponIndex)'), 'character: attack bonuses must use stable weapon keys');
  assert(files.character.includes('shotsFired > 1 || isSupp'), 'character: bystander threshold must depend on actual shots/suppressive fire');
  assert(!files.character.includes('maxWeaponRoF'), 'character: weapon max RoF must not drive bystander threshold');
  assert(!files.threats.includes('|| isCritFail'), 'threats: crit failures must not be treated as automatic bystander hits');
  assert(files.settings.includes('const effectiveToughness = toughness + totalArmor;'), 'tracker: damage calculator must apply armor after AP');
  assert(files.threats.includes('armor: (parseInt(activeThreat.naturalArmor) || 0) + (parseInt(activeThreat.wornArmor) || 0) + (parseInt(activeThreat.forceField) || 0),'), 'threats: deployed threats must retain armor for tracker AP handling');
  assert(files.character.includes('lastSoakHit'), 'character: damage must snapshot pre-hit wounds for SWADE soak');
  assert(files.threats.includes('lastSoakHit'), 'threats: damage must snapshot pre-hit wounds for SWADE soak');
  assert(files.tracker.includes('lastSoakHit'), 'tracker: soak must use pre-hit snapshot');
  assert(files.character.includes('ignoring'), 'character: soak log must disclose ignored new wounds');
  assert(files.settings.includes('function computeStatusPenalty'), 'settings: unified status penalty helper must exist');
  assert(files.settings.includes('function resolveTraitSource'), 'settings: 0-safe source helper must exist');
  assert(files.settings.includes('function computeTraitModifier'), 'settings: unified trait modifier helper must exist');
  assert(files.character.includes('computeStatusPenalty'), 'character: must use unified status penalty');
  assert(files.tracker.includes('computeStatusPenalty'), 'tracker: must use unified status penalty');
  assert(files.threats.includes('computeStatusPenalty'), 'threats: must use unified status penalty');
  assert(files.threats.includes('steadyHands'), 'threats: must honor Steady Hands for Running');
  assert(files.tracker.includes('steadyHands'), 'tracker: must honor Steady Hands for Running');
  assert(files.character.includes('_targetDefending') || files.character.includes('targetAlreadyDefending') || files.character.includes('!target.defending'), 'character: Defend must not double-count (+4 TN and -4 roll)');
  assert(!files.character.includes('charData.wounds || combatParticipant.wounds'), 'character: must use ?? not || for wounds (0-safe)');
  assert(!files.character.includes('charData.fatigue || combatParticipant.fatigue'), 'character: must use ?? not || for fatigue (0-safe)');
  assert(files.tracker.includes('manual: true') || files.tracker.includes('_manualWoundsBefore'), 'tracker: manual GM wound adds must snapshot soak window');
}

function parseDamageFormulaLikeSheet(formulaStr, strengthDie = 'd12', strengthMod = '+12') {
  if (!formulaStr) return { dice: [], modifier: 0 };

  const strDie = strengthDie.toString().toLowerCase().startsWith('d') ? strengthDie : `d${strengthDie}`;
  const strModVal = parseInt(strengthMod.replace('+', ''), 10) || 0;
  let strReplacement = strDie;
  if (strModVal > 0) strReplacement += `+${strModVal}`;
  else if (strModVal < 0) strReplacement += `${strModVal}`;

  const processedFormula = formulaStr.toString().replace(/Str/i, strReplacement);
  const tokens = processedFormula.match(/[+-]?\s*\d*d\d+|[+-]?\s*\d+/gi) || [];
  const dice = [];
  let modifier = 0;

  for (let token of tokens) {
    token = token.replace(/\s/g, '');
    const sign = token.startsWith('-') ? -1 : 1;
    token = token.replace(/^[+-]/, '');
    const match = token.match(/^(\d*)d(\d+)$/i);
    if (match) {
      const count = parseInt(match[1], 10) || 1;
      const sides = parseInt(match[2], 10);
      for (let i = 0; i < count; i++) dice.push({ sides, sign });
    } else {
      const val = parseInt(token, 10);
      if (!Number.isNaN(val)) modifier += val * sign;
    }
  }

  return { dice, modifier };
}

function bodyBetween(source, from, to) {
  const a = source.indexOf(from);
  const b = source.indexOf(to, a + 1);
  return source.slice(a, b === -1 ? source.length : b);
}

function checkBreachInvariants() {
  const source = files.breach;

  const startGame = bodyBetween(source, 'function startGame(', 'function endGame(');
  assert(startGame.includes("showScreen('game-screen')"), 'breach: startGame must show game screen');
  assert(startGame.indexOf('showScreen') < startGame.indexOf('render();'), 'breach: render must run after the screen is visible (no 0x0 clump)');
  assert(startGame.includes("document.querySelectorAll('#network-container .node')"), 'breach: startGame must remove ghost nodes from previous grids');
  assert(startGame.includes('state.angles = state.grid.map'), 'breach: cumulative rotation angles must be initialised');

  const handleClick = bodyBetween(source, 'function handleClick(', 'function startTimer(');
  assert(handleClick.includes('state.active = false;'), 'breach: win must deactivate state before scheduling endGame (no double webhook)');
  assert(handleClick.indexOf('state.active = false;') < handleClick.indexOf('setTimeout(() => endGame(true), 200)'), 'breach: active flag must clear before the endGame timeout');
  assert(handleClick.includes('state.angles[r][c]'), 'breach: clicks must accumulate rotation angle for animation');

  const render = bodyBetween(source, 'function render()', 'function handleClick(');
  assert(render.includes("node.querySelector('.node-rotator')"), 'breach: nodes must render via a rotating inner wrapper');
  assert(/node\.style\.width = nodeSize \+ 'px';/.test(render), 'breach: node size must be set every render');
  assert(/node\.style\.width = nodeSize \+ 'px';\s*\r?\n\s*node\.style\.height = nodeSize \+ 'px';/.test(render), 'breach: width/height must update alongside position on resize');
  assert((render.match(/node\.style\.width = nodeSize \+ 'px';/g) || []).length === 1, 'breach: node size must not live only inside the creation block');

  assert(source.includes('endpoint: [0]'), 'breach: dedicated endpoint piece type must exist');
  assert(source.includes("['straight','corner','tee']"), 'breach: cross must be dropped from filler pieces');
  assert(!source.includes("['straight','corner','tee','cross']"), 'breach: cross must be dropped from filler pieces');
  assert(source.includes('piece.type = \'endpoint\''), 'breach: path endpoints must become endpoint pieces');
  assert(source.includes('piece.locked = true;'), 'breach: source/target terminals must be locked');

  assert(source.includes('let path = genPath(sz, sz);'), 'breach: puzzle generation must retry pathfinding');
  assert(source.includes('const tR = sz - 1, tC = sz - 1;'), 'breach: pathfinding retry must target the goal cell');

  assert(source.includes('state.endTime = Date.now() + state.diff.time * 1000'), 'breach: timer must be real-time based');
  assert(source.includes('function tickTimer()'), 'breach: timer must recompute remaining time each tick');

  assert(source.includes('grid: 6, time: 40'), 'breach: HARD must be beatable (40s)');
  assert(source.includes('width: min(650px, 100%, calc(100vh - 240px))'), 'breach: board must fit the viewport height');
  assert(source.includes('id="abort-btn"'), 'breach: abort button required');
  assert(source.includes('id="mute-btn"'), 'breach: mute button required');
  assert(source.includes('result-best-time') && source.includes('result-best-rot'), 'breach: per-difficulty best stats must be shown');
  assert(source.includes("localStorage.getItem('breach_muted')"), 'breach: mute preference must persist');
}

function shouldPromptForContextualDamage(damageStr) {
  const parsed = parseDamageFormulaLikeSheet(damageStr, 'd6', '+0');
  return parsed.dice.length === 0 && parsed.modifier === 0 && !damageStr.toString().match(/\d/);
}

function calcDamageLikeTracker(roll, toughness, armor = 0, ap = 0) {
  const effectiveArmor = Math.max(0, armor - Math.max(0, ap));
  const effectiveToughness = toughness + effectiveArmor;
  if (roll < effectiveToughness) return { outcome: 'none', effectiveToughness };
  const wounds = Math.floor((roll - effectiveToughness) / 4);
  return { outcome: wounds === 0 ? 'shaken' : 'wounds', wounds, effectiveToughness };
}

function bystanderLikeCharacter({ traitTotal, traitFirst, wildTotal, targetNumber, totalModifier = 0, shotsFired = 1, isSupp = false, isShotgun = false }) {
  const threshold = (shotsFired > 1 || isSupp || isShotgun) ? 2 : 1;
  if (shotsFired > 1) {
    return traitTotal + totalModifier < targetNumber && traitFirst <= threshold;
  }
  const bestTotal = Math.max(traitTotal, wildTotal) + totalModifier;
  return bestTotal < targetNumber && traitFirst <= threshold && wildTotal + totalModifier < targetNumber;
}

function soakPenaltyLikeFix(currentWounds, fatigue, lastSoakHit) {
  let penaltyWounds = currentWounds || 0;
  if (lastSoakHit && typeof lastSoakHit.woundsBefore === 'number' && (currentWounds || 0) >= lastSoakHit.woundsBefore && (lastSoakHit.woundsAdded || 0) > 0) {
    penaltyWounds = Math.min(currentWounds || 0, lastSoakHit.woundsBefore);
  }
  return (-(Math.min(penaltyWounds, 3) + Math.min(fatigue || 0, 2))) || 0;
}

function statusPenaltyLikeUnified(wounds, fatigue, distracted) {
  const w = Math.min(Math.max(0, parseInt(wounds) || 0), 3);
  const f = Math.min(Math.max(0, parseInt(fatigue) || 0), 2);
  return ((-(w + f + (distracted ? 2 : 0))) || 0);
}

function traitModifierLikeUnified(o) {
  o = o || {};
  return (parseInt(o.traitMod) || 0) + (parseInt(o.customModifier) || 0) + (parseInt(o.statusPenalty) || 0) + (parseInt(o.jokerBonus) || 0) + (parseInt(o.wildAttackBonus) || 0) + (parseInt(o.defenderModifier) || 0) + (parseInt(o.calledHitMod) || 0) + (parseInt(o.edgeBonus) || 0);
}

checkSourceInvariants();
checkBreachInvariants();

assert.deepEqual(parseDamageFormulaLikeSheet('Str+d10'), {
  dice: [{ sides: 12, sign: 1 }, { sides: 10, sign: 1 }],
  modifier: 12,
}, 'Str+d10 with d12+12 Strength must keep the fixed +12 modifier');
assert.equal(shouldPromptForContextualDamage('Special'), true, 'Special damage must prompt for a custom formula');
assert.equal(shouldPromptForContextualDamage('Varies'), true, 'Varies damage must prompt for a custom formula');

assert.deepEqual(calcDamageLikeTracker(9, 8, 2, 0), { outcome: 'none', effectiveToughness: 10 }, 'Armor must stop non-AP damage');
assert.deepEqual(calcDamageLikeTracker(9, 8, 2, 2), { outcome: 'shaken', wounds: 0, effectiveToughness: 8 }, 'AP must reduce armor before comparing damage');
assert.deepEqual(calcDamageLikeTracker(13, 8, 2, 1), { outcome: 'wounds', wounds: 1, effectiveToughness: 9 }, 'Raises over effective toughness must become wounds');

assert.equal(bystanderLikeCharacter({ traitTotal: 1, traitFirst: 1, wildTotal: 8, targetNumber: 4 }), false, 'RoF 1 Wild Card hit on Wild Die must not flag a bystander');
assert.equal(bystanderLikeCharacter({ traitTotal: 1, traitFirst: 1, wildTotal: 3, targetNumber: 4 }), true, 'RoF 1 Wild Card miss with skill die 1 must flag a bystander');
assert.equal(bystanderLikeCharacter({ traitTotal: 5, traitFirst: 1, wildTotal: 1, targetNumber: 4 }), false, 'Successful shot must not flag a bystander');
assert.equal(bystanderLikeCharacter({ traitTotal: 2, traitFirst: 2, wildTotal: 1, targetNumber: 4, shotsFired: 1 }), false, 'Single shot from a RoF>1 weapon must keep threshold 1');
assert.equal(bystanderLikeCharacter({ traitTotal: 2, traitFirst: 2, wildTotal: 1, targetNumber: 4, shotsFired: 2 }), true, 'Actually firing 2+ shots must use threshold 2');
assert.equal(bystanderLikeCharacter({ traitTotal: 2, traitFirst: 2, wildTotal: 1, targetNumber: 4, isSupp: true }), true, 'Suppressive fire must use threshold 2');
assert.equal(bystanderLikeCharacter({ traitTotal: 2, traitFirst: 2, wildTotal: 1, targetNumber: 4, isShotgun: true }), true, 'Shotguns must use threshold 2');

// SWADE soak ignores the wounds from the attack being soaked.
assert.equal(soakPenaltyLikeFix(2, 0, { woundsBefore: 0, woundsAdded: 2 }), 0, 'Soak after 0->2 wounds must ignore new wounds (Katey Commons case: Vigor 6 stays 6, not 4)');
assert.equal(soakPenaltyLikeFix(3, 0, { woundsBefore: 1, woundsAdded: 2 }), -1, 'Soak must still count pre-existing wounds');
assert.equal(soakPenaltyLikeFix(2, 0, null), -2, 'Soak without a snapshot must fall back to current wounds');

// Unified modifier core: same inputs must give same outputs on every page.
assert.equal(statusPenaltyLikeUnified(2, 1, true), -5, 'Unified status: 2 wounds + 1 fatigue + Distracted = -5');
assert.equal(statusPenaltyLikeUnified(0, 0, false), 0, 'Unified status: clean = 0 (no -0)');
assert.equal(statusPenaltyLikeUnified(5, 5, true), -7, 'Unified status caps: min(w,3)+min(f,2)+2 = -7 max');
assert.equal(traitModifierLikeUnified({ traitMod: 0, customModifier: -4, statusPenalty: -2, jokerBonus: 2, wildAttackBonus: 0, defenderModifier: 2, calledHitMod: -4 }), -6, 'Unified addition order must be stable');
assert.equal(traitModifierLikeUnified({ traitMod: 0, customModifier: -4, statusPenalty: -2, jokerBonus: 0, wildAttackBonus: 0, defenderModifier: 2, calledHitMod: -4 }), -8, 'Joker delta must be exactly +2');
// Manual GM wound adds get the same soak window as auto damage.
assert.equal(soakPenaltyLikeFix(1, 0, { woundsBefore: 0, woundsAdded: 1, manual: true }), 0, 'Manual GM +1 wound must not penalize the follow-up soak');

console.log('Regression checks passed.');
