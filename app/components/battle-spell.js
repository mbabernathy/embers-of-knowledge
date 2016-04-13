import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  actions: {
    castSpell() {
      this.get('effect')();
    }
  }
});
