import Ember from 'ember';

export default Ember.Service.extend({
  roundTurns: 1,
  roundDamage: 0,
  roundHealed: 0,
  roundSummons: 0,
  roundKills: 0,
  roundSpells: 0,
  roundManaGained: 0,
  roundManaSpent: 0,

  incrementTurn() {
    this.set('roundTurns', this.get('roundTurns') + 1);
  },
  trackDamage(amount) {
    this.set('roundDamage', this.get('roundDamage') + amount);
  },
  trackHealing(amount) {
    this.set('roundHealed', this.get('roundHealed') + amount);
  },
  trackCreatureSummoned() {
    this.set('roundSummons', this.get('roundSummons') + 1);
  },
  trackCreaturesKilled(numKilled) {
    this.set('roundKills', this.get('roundKills') + numKilled);
  },
  trackManaGained(amount) {
    this.set('roundManaGained', this.get('roundManaGained') + amount);
  },
  trackSpellCast(manaCost) {
    var totalCost = 0;
    if (manaCost.neutral) {
      totalCost += manaCost.neutral;
    }
    if (manaCost.life) {
      totalCost += manaCost.life;
    }
    if (manaCost.phys) {
      totalCost += manaCost.phys;
    }
    if (manaCost.illusion) {
      totalCost += manaCost.illusion;
    }
    if (manaCost.death) {
      totalCost += manaCost.death;
    }
    this.set('roundSpells', this.get('roundSpells') + 1);
    this.set('roundManaSpent', this.get('roundManaSpent') + totalCost);
  },
  resetCombatStats() {
    this.set('roundTurns', 1);
    this.set('roundDamage', 0);
    this.set('roundHealed', 0);
    this.set('roundSummons', 0);
    this.set('roundKills', 0);
    this.set('roundSpells', 0);
    this.set('roundManaGained', 0);
    this.set('roundManaSpent', 0);
  }
});
