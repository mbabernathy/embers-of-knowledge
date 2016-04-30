import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  combatMessages: null,
  actions: {
    clearCombatInfo() {
      this.get('game.combatMessages').clear();
      this.get('game').endTurn();
    }
  }
});
