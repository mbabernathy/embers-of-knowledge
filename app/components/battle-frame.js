import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  info: Ember.inject.service('info'),
  game: Ember.inject.service('game'),
  player: Ember.inject.service('player'),
  chosenSpellSchool: 'neutral',

  doingBattle: Ember.computed.bool('player.isBattling'),
  showNewTurn: Ember.computed.bool('info.startingNewTurn'),
  showDiceInfoModal: Ember.computed.notEmpty('info.diceMessages'),
  showCombatRecapModal: Ember.computed.notEmpty('info.combatMessages'),
  showManaLeftWarning: Ember.computed.bool('info.manaRemainingWarning'),
  actions: {
    rollDice() {
      this.get('info').hideNewTurnStats();
      this.get('game').rollAllDice();
    },
    setChosenSchool(chosenSchool) {
      this.set('chosenSpellSchool', chosenSchool);
    },
    doBattle() {
      this.get('info').hideRemainingManaWarning();
      this.get('game').resolveCombat();
    },
    clearManaWarning() {
      this.get('info').hideRemainingManaWarning();
    }
  }
});
