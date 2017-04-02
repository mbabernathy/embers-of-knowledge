import Ember from 'ember';

export default Ember.Service.extend({
  game: Ember.inject.service('game'),
  stats: Ember.inject.service('stats'),
  max_life: 5,
  player_money: 0,
  player_dice: [
    {
      dice_school : 'life',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
    {
      dice_school : 'phys',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
    {
      dice_school : 'illusion',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
    {
      dice_school : 'death',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
  ],
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
  }
});
