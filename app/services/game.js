import Ember from 'ember';

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
  opponent_life: 5,
  opponent_mana: {
    neutral: '?',
    life: '?',
    phys: '?',
    illusion: '?',
    death: '?',
  },
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
  },
  healPlayer(amount) {
    this.set('player_life', this.get('player_life') + amount);
  },
  harmOpponent(amount) {
    this.set('opponent_life', this.get('opponent_life') - amount);
    // TODO trigger end match
  },
  rollAllDice() {
    this.get('player_dice').forEach((dice) => {
      var total_sides = dice.neutral_sides + dice.school_sides + dice.crit_sides;
      var roll = Math.ceil(Math.random() * total_sides);
      console.log('Roll for ' + dice.dice_school + ' dice was ' + roll);
      if (roll <= dice.neutral_sides) {
        // give neutral mana
        this.addNeutralMana(roll);
        console.log('Mana earned: '+ dice.dice_school + ' dice added ' + roll + ' neutral mana');
      } else if (roll > total_sides - dice.crit_sides) {
        // critical roll scored
        switch (dice.dice_school) {
          case 'life':
            this.healPlayer(2);
            break;
          case 'death':
            this.harmOpponent(2);
            break;
/*          case 'phys':
          case 'illusion':*/
          default:

        }
        console.log('CRIT! earned: '+ dice.dice_school + ' created critical effect!');
      } else {
        // give school mana
        this.addSchoolMana(dice.dice_school, roll - dice.neutral_sides);
        console.log('Mana earned: '+ dice.dice_school + ' dice added ' + (roll - dice.neutral_sides) + ' '+ dice.dice_school +' mana');
      }
    });
  }

});
