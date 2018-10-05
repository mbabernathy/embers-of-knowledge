import Ember from 'ember';

export default Ember.Service.extend({
  game: Ember.inject.service('game'),
  stats: Ember.inject.service('stats'),
  max_life: 5,
  player_money: 0,
  player_dice: [
    Ember.Object.create({
      dice_school : 'life',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    }),
    Ember.Object.create({
      dice_school : 'phys',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    }),
    Ember.Object.create({
      dice_school : 'illusion',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    }),
    Ember.Object.create({
      dice_school : 'death',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    }),
  ],
  knownSpells: ['0-00', '1-00', '3-00', '5-00', '7-00'],
  isBattling: true,

  endBattlePhase() {
    this.set('player_money', this.get('player_money') + this.get('stats.expectedIncome'));

    // Switch out of battleframe
    this.set('isBattling', false);
  },

  startNewBattle() {
    this.set('isBattling', true);
    this.get('game').createNewBattle();
  },

  spendMoney(amount) {
    this.set('player_money', this.get('player_money') - amount);
  },

  costFunction(step) {
    const costArray = [1, 2, 5];
    let cost = Math.pow(10, (parseInt(step / 3))) * (costArray[step % 3]);
    return cost;
  },

  costForDiceSide(dice) {
    let totalSides = dice.neutral_sides + dice.school_sides + dice.crit_sides;
    return this.costFunction(totalSides);
  },

  upgradeDiceNeutralSide(dice) {
    let cost = this.costForDiceSide(dice);
    if (this.get('player_money') < cost) {
      return;
    }
    this.spendMoney(cost);
    dice.set('neutral_sides', dice.get('neutral_sides') + 1);
  },

  upgradeDiceSchoolSide(dice) {
    let cost = this.costForDiceSide(dice);
    if (this.get('player_money') < cost) {
      return;
    }
    this.spendMoney(cost);
    dice.set('school_sides', dice.get('school_sides') + 1);
  },

  upgradeDiceCritSide(dice) {
    let cost = this.costForDiceSide(dice);
    if (this.get('player_money') < cost) {
      return;
    }
    this.spendMoney(cost);
    dice.set('crit_sides', dice.get('crit_sides') + 1);
  },

  buySpell(spell) {
    // make sure not already known
    if (this.get('knownSpells').includes(spell.id)) {
      return;
    }
    // check sufficient money
    if (this.get('player_money') < spell.buyCost) {
      return;
    }
    // do the transaction
    this.spendMoney(spell.buyCost);
    this.get('knownSpells').pushObject(spell.id);
  }
});
