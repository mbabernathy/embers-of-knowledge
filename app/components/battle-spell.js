import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  spell: null,
  actions: {
    castSpell() {
      this.get('spell.effect')();
    }
  }
});
