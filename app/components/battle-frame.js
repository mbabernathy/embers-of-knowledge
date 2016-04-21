import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  game: Ember.inject.service('game'),
  chosenSpellSchool: 'neutral',

  showDiceInfoModal: Ember.computed.notEmpty('game.diceMessages'),
  actions: {
    rollDice() {
      this.get('game').rollAllDice();
    },
    setChosenSchool(chosenSchool) {
      this.set('chosenSpellSchool', chosenSchool);
    }
  }
});
