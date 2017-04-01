import Ember from 'ember';

export default Ember.Service.extend({
  game: Ember.inject.service('game'),
  stats: Ember.inject.service('stats'),
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
    let earnings = 0;
    // Figure out winnings
    earnings += this.get('stats.roundTurns') * 5;
    earnings += this.get('stats.roundDamage') * 2;
    earnings += this.get('stats.roundHealed') * 2;
    earnings += this.get('stats.roundSummons') * 2;
    earnings += this.get('stats.roundKills') * 2;
    earnings += this.get('stats.roundSpells') * 1;
    earnings += this.get('stats.roundManaGained') * 1;
    earnings += this.get('stats.roundManaSpent') * 1;
    this.set('player_money', this.get('player_money') + earnings);

    // Switch out of battleframe
    this.set('isBattling', false);
  },

  startNewBattle() {
    this.set('isBattling', true);
    this.get('game').createNewBattle();
  }
});
