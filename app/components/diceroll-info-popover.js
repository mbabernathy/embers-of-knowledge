import Ember from 'ember';

export default Ember.Component.extend({
  info: Ember.inject.service('info'),
  diceMessages: null,
  actions: {
    clearDiceInfo() {
      this.get('info').clearDiceMessages();
    }
  }
});
