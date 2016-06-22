import Ember from 'ember';

export default Ember.Component.extend({
  info: Ember.inject.service('info'),
  game: Ember.inject.service('game'),
  combatMessages: null,
  actions: {
    clearCombatInfo() {
      this.get('info').clearCombatMessages();
      this.get('game').endTurn();
    }
  }
});
