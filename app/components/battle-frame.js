import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  info: Ember.inject.service('info'),
  game: Ember.inject.service('game'),
  player: Ember.inject.service('player'),
  chosenSpellSchool: 'neutral',

  showNewTurn: Ember.computed.bool('info.startingNewTurn'),
  showDiceInfoModal: Ember.computed.notEmpty('info.diceMessages'),
  showCombatRecapModal: Ember.computed.notEmpty('info.combatMessages'),
  showManaLeftWarning: Ember.computed.bool('info.manaRemainingWarning'),
  showEndBattleModal: Ember.computed('game.{player_life,opponent_life}', function() {
    return (this.get('game.player_life') <= 0 || this.get('game.opponent_life') <= 0);
  }),
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
    },
    goToStore() {
      this.get('player').endBattlePhase();
    },
    clearDiceInfoMessages() {
      this.get('info').clearDiceMessages();
    },
    clearCombatInfoMessages() {
      this.get('info').clearCombatMessages();
      this.get('game').endTurn();
    }
  }
});
