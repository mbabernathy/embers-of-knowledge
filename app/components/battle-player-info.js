import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['manaflexbox'],
  info: Ember.inject.service('info'),
  game: Ember.inject.service('game'),
  health: null,
  mana: null,
  playerInfo: false,
  noMana: Ember.computed('mana.{life,phys,illusion,death}', function() {
    return (this.get('mana.life') + this.get('mana.phys') + this.get('mana.illusion') + this.get('mana.death')) === 0;
  }),
  doneButtonClass: Ember.computed('noMana', function() {
    return this.get('noMana') ? 'btn-primary' : 'btn-default';
  }),
  actions: {
    finishCastPhase() {
      if (!this.get('noMana')) {
        this.get('info').showRemainingManaWarning();
      } else {
        this.get('game').resolveCombat();
      }
    }
  }
});
