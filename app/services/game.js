import Ember from 'ember';
import { prettifySchool } from 'embers-of-knowledge/helpers/prettify-school';

export default Ember.Service.extend({
  stats: Ember.inject.service('stats'),
  max_life: 5,
  player_dice: [
    {
      dice_school : 'life',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
    {
      dice_school : 'phys',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
    {
      dice_school : 'illusion',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
    {
      dice_school : 'death',
      neutral_sides : 1,
      school_sides : 1,
      crit_sides : 1
    },
  ],

  player_life: 5,
  player_mana: {
    neutral: 0,
    life: 0,
    phys: 0,
    illusion: 0,
    death: 0,
  },
  player_counterspell_tokens: 0,
  player_creatures: [],
  opponent_life: 5,
  opponent_mana: {
    neutral: '?',
    life: '?',
    phys: '?',
    illusion: '?',
    death: '?',
  },
  opponent_counterspell_tokens: 0,
  opponent_creatures: [],

  startingNewTurn: true,
  diceMessages: [],
  combatMessages: [],
  manaRemainingWarning: false,

  addNeutralMana(amount) {
    this.get('stats').trackManaGained(amount);
    this.set('player_mana.neutral', this.get('player_mana.neutral') + amount);
  },
  addSchoolMana(school, amount) {
    this.get('stats').trackManaGained(amount);
    switch (school) {
      case 'life':
        this.set('player_mana.life', this.get('player_mana.life') + amount);
        break;
      case 'phys':
        this.set('player_mana.phys', this.get('player_mana.phys') + amount);
        break;
      case 'illusion':
        this.set('player_mana.illusion', this.get('player_mana.illusion') + amount);
        break;
      case 'death':
        this.set('player_mana.death', this.get('player_mana.death') + amount);
        break;
      default:

    }
  },

  hasEnoughMana(cost){
    if (cost.life && cost.life > this.get('player_mana.life')) {
      return false;
    }
    if (cost.death && cost.death > this.get('player_mana.death')) {
      return false;
    }
    if (cost.phys && cost.phys > this.get('player_mana.phys')) {
      return false;
    }
    if (cost.illusion && cost.illusion > this.get('player_mana.illusion')) {
      return false;
    }
    if (cost.neutral && cost.neutral > this.get('player_mana.neutral')) {
      return false;
    }
    return true;
  },
  castSpell(spell) {
    // Make sure they can cast spell
    if (!this.hasEnoughMana(spell.cost)) {
      return;
    }
    // Deduct mana now
    if (spell.cost.life) {
      this.set('player_mana.life', this.get('player_mana.life') - spell.cost.life);
    }
    if (spell.cost.death) {
      this.set('player_mana.death', this.get('player_mana.death') - spell.cost.death);
    }
    if (spell.cost.phys) {
      this.set('player_mana.phys', this.get('player_mana.phys') - spell.cost.phys);
    }
    if (spell.cost.illusion) {
      this.set('player_mana.illusion', this.get('player_mana.illusion') - spell.cost.illusion);
    }
    if (spell.cost.neutral) {
      this.set('player_mana.neutral', this.get('player_mana.neutral') - spell.cost.neutral);
    }
    this.get('stats').trackSpellCast(spell.cost);

    // Check for counterspell
    if (this.get('opponent_counterspell_tokens') >= 1) {
      this.set('opponent_counterspell_tokens', this.get('opponent_counterspell_tokens') - 1);
      // TODO: Do something to inform player their spell was countered?
      return;
    }

    // Cast spell effects
    if (spell.effects.healPlayer) {
      this.healPlayer(spell.effects.healPlayer);
    }
    if (spell.effects.harmOpponent) {
      this.harmOpponent(spell.effects.harmOpponent);
    }
    // The undefined check is needed here since adding
    // a creature of strength 0 is valid, but fails the normal if check
    if (typeof spell.effects.addCreature !== 'undefined') {
      this.addCreatureAlly(spell.effects.addCreature);
    }
    if (spell.effects.desert) {
      this.creatureDesert(spell.effects.desert);
    }
  },
  healPlayer(amount) {
    this.get('stats').trackHealing(amount);
    this.set('player_life', this.get('player_life') + amount);
  },
  harmOpponent(amount) {
    this.get('stats').trackDamage(amount);
    this.set('opponent_life', this.get('opponent_life') - amount);
    // TODO trigger end match
  },
  harmPlayer(amount) {
    this.get('stats').trackDamage(amount);
    this.set('player_life', this.get('player_life') - amount);
  },
  addCreatureAlly(strength) {
    this.get('stats').trackCreatureSummoned();
    this.get('player_creatures').pushObject(strength);
    this.set('player_creatures', this.get('player_creatures').sort((a,b)=>{return b-a;}));
  },
  addCreatureRival(strength) {
    this.get('stats').trackCreatureSummoned();
    this.get('opponent_creatures').pushObject(strength);
    this.set('opponent_creatures', this.get('opponent_creatures').sort((a,b)=>{return b-a;}));
  },
  creatureDesert(target) {
    if (target === 0) {
      return;
    }
    var index = this.get('opponent_creatures').indexOf(target);
    if (index !== -1) {
      this.get('opponent_creatures').removeAt(index);
      this.get('opponent_creatures').pushObject(0);
      this.set('opponent_creatures', this.get('opponent_creatures').sort((a,b)=>{return b-a;}));
    }
    else { // no creatures of that strength exist, try one lower
      this.creatureDesert(target - 1);
    }
  },
  rollAllDice() {
    this.get('player_dice').forEach((dice) => {
      var schoolName = prettifySchool([dice.dice_school]);
      var total_sides = dice.neutral_sides + dice.school_sides + dice.crit_sides;
      var roll = Math.ceil(Math.random() * total_sides);
      console.log('Roll for ' + schoolName + ' dice was ' + roll);
      if (roll <= dice.neutral_sides) {
        // give neutral mana
        this.addNeutralMana(roll);
        this.get('diceMessages').pushObject((schoolName + ' dice added ' + roll + ' Neutral mana'));
      } else if (roll > total_sides - dice.crit_sides) {
        // critical roll scored
        switch (dice.dice_school) {
          case 'life':
            this.healPlayer(2);
            this.get('diceMessages').pushObject((schoolName + ' dice crit! You gained 2 health!'));
            break;
          case 'death':
            this.harmOpponent(2);
            this.get('diceMessages').pushObject((schoolName + ' dice crit! Opponent lost 2 health!'));
            break;
          case 'phys':
            // Add two 1 strength creatures
            this.addCreatureAlly(1);
            this.addCreatureAlly(1);
            this.get('diceMessages').pushObject((schoolName + ' dice crit! You gained 2 creatures of strength 1!'));
            break;
          case 'illusion':
            this.set('player_counterspell_tokens', this.get('player_counterspell_tokens') + 1);
            this.get('diceMessages').pushObject((schoolName + ' dice crit! You gained a counterspell token!'));
            break;
          default:
        }
      } else {
        // give school mana
        this.addSchoolMana(dice.dice_school, roll - dice.neutral_sides);
        this.get('diceMessages').pushObject((schoolName + ' dice added ' + (roll - dice.neutral_sides) + ' '+ schoolName +' mana'));
      }
    });
  },
  resolveCombat() {
    // TODO trigger precombat stuff
    // Convert all remaining counterspell tokens into strenght 0 creatures
    if (this.get('player_counterspell_tokens') > 0) {
      this.get('player_creatures').pushObjects(Array(this.get('player_counterspell_tokens')).fill(0));
    }
    if (this.get('opponent_counterspell_tokens') > 0) {
      this.get('opponent_creatures').pushObjects(Array(this.get('opponent_counterspell_tokens')).fill(0));
    }

    // First, find out who has more creatures;
    var playerHasMoreCreatures = (this.get('player_creatures').length >= this.get('opponent_creatures').length);

    // Sort creatures such that larger arrray desc; smaller ascend
    var largerCreatureList;
    var smallerCreatureList;
    if (playerHasMoreCreatures) {
      largerCreatureList = this.get('player_creatures');
      smallerCreatureList = this.get('opponent_creatures');
    } else {
      largerCreatureList = this.get('opponent_creatures');
      smallerCreatureList = this.get('player_creatures');
    }
    largerCreatureList.sort((a,b)=>{return b-a;});
    smallerCreatureList.sort((a,b)=>{return a-b;});
    console.log('COMBAT: '+ largerCreatureList + " vs " + smallerCreatureList);

    var defeatedCreatures = 0;
    // Face off the creaters in index order; kill loser & ties
    for (var i=0; i<smallerCreatureList.length; i++) {
      if (smallerCreatureList[i] > largerCreatureList[i]) {
        largerCreatureList[i] = 0;
        defeatedCreatures++;
      } else if (smallerCreatureList[i] < largerCreatureList[i]) {
        smallerCreatureList[i] = 0;
        defeatedCreatures++;
      } else {
        largerCreatureList[i] = 0;
        smallerCreatureList[i] = 0;
        defeatedCreatures += 2;
      }
    }

    if (defeatedCreatures > 0) {
      this.get('stats').trackCreaturesKilled(defeatedCreatures);
      this.get('combatMessages').pushObject((defeatedCreatures + ' creatures perished in combat'));
    }
    // Deal damage to player with least creatures from unblocked
    var damage = 0;
    for (var j=smallerCreatureList.length; j<largerCreatureList.length; j++) {
      damage += largerCreatureList[j];
    }
    if(playerHasMoreCreatures) {
      this.harmOpponent(damage);
      if (damage > 0) {
        this.get('combatMessages').pushObject(('Your creatures dealt '+ damage +' damage to your opponent'));
      }
      this.set('player_creatures', largerCreatureList);
      this.set('opponent_creatures', smallerCreatureList);
    } else {
      this.harmPlayer(damage);
      if (damage > 0) {
        this.get('combatMessages').pushObject(('Your rival\'s creatures dealt '+ damage +' damage to you'));
      }
      this.set('opponent_creatures', largerCreatureList);
      this.set('player_creatures', smallerCreatureList);
    }

    // Remove dead creatures & sort
    this.set('player_creatures', this.get('player_creatures').sort((a,b)=>{return b-a;}));
    this.set('opponent_creatures', this.get('opponent_creatures').sort((a,b)=>{return b-a;}));

    this.get('player_creatures').removeObject(0);
    this.get('opponent_creatures').removeObject(0);

    if (this.get('combatMessages').length === 0) {
      this.get('combatMessages').pushObject('Nothing interesting happed...');
    }
  },
  endTurn() {
    // Clean out any unspent mana
    this.set('player_mana.life', 0);
    this.set('player_mana.phys', 0);
    this.set('player_mana.illusion', 0);
    this.set('player_mana.death', 0);
    if (this.get('player_mana.neutral') > this.get('max_life')) {
      this.set('player_mana.neutral', this.get('max_life'));
    }

    // Deal with overheal
    if (this.get('player_life') > this.get('max_life')) {
      var hpDiff = this.get('player_life') - this.get('max_life');
      this.set('player_life', this.get('player_life') - Math.ceil(0.25 * hpDiff));
    }

    // Trigger new turn
    this.get('stats').incrementTurn();
    this.set('startingNewTurn', true);
  }

});
