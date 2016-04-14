import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  game: Ember.inject.service('game'),
  chosenSpellSchool: 'neutral',

  actions: {
    rollDice() {
      this.get('game').rollAllDice();
    },
    setChosenSchool(chosenSchool) {
      this.set('chosenSpellSchool', chosenSchool);
    }
  }
});
