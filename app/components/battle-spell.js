import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  spell: null,
  actions: {
    castSpell() {
      if(this.get('game').preCastChecks(this.get('spell.cost'))) {
        this.get('spell.effect')();
      }
    }
  }
});
