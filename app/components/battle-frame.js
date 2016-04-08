import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  game: Ember.inject.service('game'),

  actions: {
    rollDice() {
      this.get('game').rollAllDice();
    }
  }
});
