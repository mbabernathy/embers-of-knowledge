import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  spell: null,
  cantCast: Ember.computed('game.player_mana.{neutral,life,phys,illusion,death}', function() {
    return !this.get('game').hasEnoughMana(this.get('spell.cost'));
  })
});
