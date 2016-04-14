import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    setPickedSchool(chosenSchool) {
      this.get('chooseSpell')(chosenSchool);
    }
  }
});
