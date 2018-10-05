import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  player: Ember.inject.service('player'),
  spell: null,
  inStore: false,
  cantCast: Ember.computed('game.player_mana.{neutral,life,phys,illusion,death}', function() {
    return !this.get('game').hasEnoughMana(this.get('spell.cost'));
  }),
  cantAfford: Ember.computed('player.player_money', function() {
    return this.get('player.player_money') < this.get('spell.buyCost');
  })
});
