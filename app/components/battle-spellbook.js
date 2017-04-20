import Ember from 'ember';

export default Ember.Component.extend({
  spells: Ember.inject.service('spells'),
  player: Ember.inject.service('player'),
  chosenSchool: null,
  classNames:['spell-listing'],
  spellListAll: Ember.computed('chosenSchool', function() {
    return this.get('spells').getKnownSchoolSpells(this.get('chosenSchool'));
  }),
  spellList: Ember.computed.filter('spellListAll', function(spell, index, array) {
    return this.get('player').knownSpells.includes(spell.id);
  }),
  noKnownSpells: Ember.computed.empty('spellList')
});
