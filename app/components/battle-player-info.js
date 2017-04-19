import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['manaflexbox'],
  playerInfo: false,
  noMana: Ember.computed('mana.{life,phys,illusion,death}', function() {
    return (this.get('mana.life') + this.get('mana.phys') + this.get('mana.illusion') + this.get('mana.death')) === 0;
  }),
  doneButtonClass: Ember.computed('noMana', function() {
    return this.get('noMana') ? 'btn-primary' : 'btn-default';
  })
});
