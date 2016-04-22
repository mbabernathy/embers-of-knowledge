import Ember from 'ember';
import { prettifySchool } from 'embers-of-knowledge/helpers/prettify-school';

export default Ember.Service.extend({
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
  player_creatures: [],
  opponent_life: 5,
  opponent_mana: {
    neutral: '?',
    life: '?',
    phys: '?',
    illusion: '?',
    death: '?',
  },
  opponent_creatures: [2,1,1,0],

  diceMessages: [],

  addNeutralMana(amount) {
    this.set('player_mana.neutral', this.get('player_mana.neutral') + amount);
  },
  addSchoolMana(school, amount) {
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
    // Check for counterspell
    // TODO: Add counterspell logic

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
    this.set('player_life', this.get('player_life') + amount);
  },
  harmOpponent(amount) {
    this.set('opponent_life', this.get('opponent_life') - amount);
    // TODO trigger end match
  },
  addCreatureAlly(strength) {
    this.get('player_creatures').pushObject(strength);
  },
  creatureDesert(target) {
    if (target === 0) {
      return;
    }
    var index = this.get('opponent_creatures').indexOf(target);
    if (index !== -1) {
      this.get('opponent_creatures').removeAt(index);
      this.get('opponent_creatures').pushObject(0);
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
/*          case 'illusion':*/
          default:
        }
      } else {
        // give school mana
        this.addSchoolMana(dice.dice_school, roll - dice.neutral_sides);
        this.get('diceMessages').pushObject((schoolName + ' dice added ' + (roll - dice.neutral_sides) + ' '+ schoolName +' mana'));
      }
    });
  }

});
