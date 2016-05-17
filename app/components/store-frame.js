import Ember from 'ember';

export default Ember.Component.extend({
  player: Ember.inject.service('player'),
  doingShopping: Ember.computed.not('player.isBattling'),
  actions: {
    gotoBattle() {
      this.get('player').startNewBattle();
    }
  }
});
