import Ember from 'ember';
import { prettifySchool } from 'embers-of-knowledge/helpers/prettify-school';

export default Ember.Service.extend({
  startingNewTurn: true,
  diceMessages: [],
  combatMessages: [],
  manaRemainingWarning: false,

  resetInfoForBattle() {
    this.get('diceMessages').clear();
    this.get('combatMessages').clear();
    this.set('startingNewTurn', true);
    this.set('manaRemainingWarning', false);
  },

  addNeutralManaInfoMessage(school, amount) {
    this.get('diceMessages').pushObject((prettifySchool(school) + ' dice added ' + amount + ' Neutral mana'));
  },

  addSchoolManaInfoMessage(school, amount) {
    var schoolName = prettifySchool(school);
    this.get('diceMessages').pushObject((schoolName + ' dice added ' + amount + ' '+ schoolName +' mana'));
  },

  addCritInfoMessage(school) {
    switch (school) {
      case 'life':
        this.get('diceMessages').pushObject('Life dice crit! You gained 2 health!');
        break;
      case 'death':
        this.get('diceMessages').pushObject('Death dice crit! Opponent lost 2 health!');
        break;
      case 'phys':
        this.get('diceMessages').pushObject('Physical dice crit! You gained 2 creatures of strength 1!');
        break;
      case 'illusion':
        this.get('diceMessages').pushObject('Illusion dice crit! You gained a counterspell token!');
        break;
      default:
    }
  },

  clearDiceMessages() {
    this.get('diceMessages').clear();
  },

  addPerishedCreaturesInfoMessage(numPerished) {
    this.get('combatMessages').pushObject((numPerished + ' creatures perished in combat'));
  },

  addFaceDamageInfoMessage(isYourFace, damage) {
    if (damage > 0) {
      if (isYourFace) {
        this.get('combatMessages').pushObject(('Your rival\'s creatures dealt '+ damage +' damage to you'));
      } else {
        this.get('combatMessages').pushObject(('Your creatures dealt '+ damage +' damage to your opponent'));
      }
    }
  },

  showCombatMessages() {
    if (this.get('combatMessages').length === 0) {
      this.get('combatMessages').pushObject('Nothing interesting happed...');
    }
  },

  clearCombatMessages() {
    this.get('combatMessages').clear();
  },

  showNewTurnStats() {
    this.set('startingNewTurn', true);
  },

  hideNewTurnStats() {
    this.set('startingNewTurn', false);
  },

  showRemainingManaWarning() {
    this.set('manaRemainingWarning', true);
  },

  hideRemainingManaWarning() {
    this.set('manaRemainingWarning', false);
  }
});
