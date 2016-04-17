import Ember from 'ember';

export default Ember.Component.extend({
  spells: Ember.inject.service('spells'),
  chosenSchool: null,
  classNames:['spell-listing'],
  spellList: Ember.computed('chosenSchool', function() {
    return this.get('spells').getKnownSchoolSpells(this.get('chosenSchool'));
  }),
  noKnownSpells: Ember.computed.empty('spellList')
});
