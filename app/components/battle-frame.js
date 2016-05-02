import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  game: Ember.inject.service('game'),
  chosenSpellSchool: 'neutral',

  showNewTurn: Ember.computed.bool('game.startingNewTurn'),
  showDiceInfoModal: Ember.computed.notEmpty('game.diceMessages'),
  showCombatRecapModal: Ember.computed.notEmpty('game.combatMessages'),
  showManaLeftWarning: Ember.computed.bool('game.manaRemainingWarning'),
  actions: {
    rollDice() {
      this.set('game.startingNewTurn', false);
      this.get('game').rollAllDice();
    },
    setChosenSchool(chosenSchool) {
      this.set('chosenSpellSchool', chosenSchool);
    },
    doBattle() {
      // TODO; can I call the action that does this from here?
      this.set('game.manaRemainingWarning', false);
      this.get('game').resolveCombat();
    },
    clearManaWarning() {
      this.set('game.manaRemainingWarning', false);
    }
  }
});
