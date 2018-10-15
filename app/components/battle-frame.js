import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['battleflexbox'],
  info: Ember.inject.service('info'),
  game: Ember.inject.service('game'),
  player: Ember.inject.service('player'),
  stats: Ember.inject.service('stats'),
  chosenSpellSchool: 'neutral',

  showNewPlayerInfo: Ember.computed.bool('info.newPlayerInfo'),
  showNewTurn: Ember.computed.bool('info.startingNewTurn'),
  showDiceInfoModal: Ember.computed.notEmpty('info.diceMessages'),
  showCombatRecapModal: Ember.computed.notEmpty('info.combatMessages'),
  showManaLeftWarning: Ember.computed.bool('info.manaRemainingWarning'),
  showEndBattleModal: Ember.computed('game.{player_life,opponent_life}', function() {
    return (this.get('game.player_life') <= 0 || this.get('game.opponent_life') <= 0);
  }),
  playerHasNoMana: Ember.computed('game.player_mana.{life,phys,illusion,death}', function() {
    return (this.get('game.player_mana.life') +
        this.get('game.player_mana.phys') +
        this.get('game.player_mana.illusion') +
        this.get('game.player_mana.death')) === 0;
  }),
  actions: {
    rollDice() {
      this.get('info').hideNewTurnStats();
      this.get('game').rollAllDice();
    },
    setChosenSchool(chosenSchool) {
      this.set('chosenSpellSchool', chosenSchool);
    },
    finishCastPhase() {
      if (!this.get('playerHasNoMana')) {
        this.get('info').showRemainingManaWarning();
      } else {
        this.get('game').resolveCombat();
      }
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
      this.get('info').clearSpellcastInfoMessages();
      this.get('game').endTurn();
    },
    castSpell(spell) {
      this.get('game').castSpell(spell);
    },
    clearNewPlayerModal() {
      this.get('info').clearNewPlayerInfo();
    }
  }
});
