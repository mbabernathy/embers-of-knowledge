import Ember from 'ember';

export default Ember.Service.extend({
  game: Ember.inject.service('game'),
  player_money: 0,
  isBattling: true,

  endBattlePhase() {
    // Figure out winnings

    // Switch out of battleframe
    this.set('isBattling', false);
  },

  startNewBattle() {
    this.set('isBattling', true);
    this.get('game').createNewBattle();
  }
});
