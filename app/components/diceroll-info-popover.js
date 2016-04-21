import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  diceMessages: null,
  actions: {
    clearDiceInfo() {
      this.get('game.diceMessages').clear();
    }
  }
});
