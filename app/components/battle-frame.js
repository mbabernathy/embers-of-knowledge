import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  game: Ember.inject.service('game'),
  chosenSpellSchool: 'neutral',

  showDiceInfoModal: Ember.computed.notEmpty('game.diceMessages'),
  showCombatRecapModal: Ember.computed.notEmpty('game.combatMessages'),
  actions: {
    rollDice() {
      this.get('game').rollAllDice();
    },
    setChosenSchool(chosenSchool) {
      this.set('chosenSpellSchool', chosenSchool);
    },
    doBattle() {
      this.get('game').resolveCombat();
    }
  }
});
