import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),

  actions: {
    setPickedSchool(chosenSchool) {
      this.get('game').set('chosenSchool', chosenSchool);
    }
  }
});
