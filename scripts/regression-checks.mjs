import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const files = {
  character: readFileSync('character.html', 'utf8'),
  tracker: readFileSync('tracker.html', 'utf8'),
  threats: readFileSync('threats.html', 'utf8'),
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
  assert(files.tracker.includes('effectiveToughness = toughness + effectiveArmor'), 'tracker: damage calculator must apply armor after AP');
  assert(files.threats.includes('armor: activeThreat.armor || 0'), 'threats: deployed threats must retain armor for tracker AP handling');
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

checkSourceInvariants();

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

console.log('Regression checks passed.');
