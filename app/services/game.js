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

  preCastChecks(cost) {
    // Make sure they can cast spell
    if (cost.life && cost.life > this.get('player_mana.life')) {
      return false;
    }
    // Deduct mana now
    if (cost.life) {
      this.set('player_mana.life', this.get('player_mana.life') - cost.life);
    }
    // Check for counterspell
    // TODO: Add counterspell logic
    return true;
  },
  healPlayer(amount) {
    this.set('player_life', this.get('player_life') + amount);
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
        console.log('CRIT! earned: '+ dice.dice_school + ' created critical effect!');
      } else {
        // give school mana
        this.addSchoolMana(dice.dice_school, roll - dice.neutral_sides);
        console.log('Mana earned: '+ dice.dice_school + ' dice added ' + (roll - dice.neutral_sides) + ' '+ dice.dice_school +' mana');
      }
    });
  }

});
