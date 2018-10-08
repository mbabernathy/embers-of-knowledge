import Ember from 'ember';

export default Ember.Service.extend({
  info: Ember.inject.service('info'),
  stats: Ember.inject.service('stats'),
  player: Ember.inject.service('player'),
  opponent: Ember.inject.service('opponent'),

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

  createNewBattle() {
    this.get('opponent_creatures').clear();
    this.get('player_creatures').clear();
    this.set('player_life', this.get('player.max_life'));
    this.set('opponent_life', this.get('player.max_life'));

    this.set('player_mana.neutral', 0);
    this.set('player_mana.life', 0);
    this.set('player_mana.phys', 0);
    this.set('player_mana.illusion', 0);
    this.set('player_mana.death', 0);

    this.get('opponent').setupRivalForMatch();
    this.get('stats').resetCombatStats();
    this.get('info').resetInfoForBattle();
  },
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

  hasEnoughMana(cost) {
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
    } else {
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
        this.creatureRivalDesert(spell.effects.desert);
      }
    }

    // Let opponent cast if they want
    this.get('opponent').castRivalSpell();
  },
  healPlayer(amount) {
    this.get('stats').trackHealing(amount);
    this.set('player_life', this.get('player_life') + amount);
  },
  healOpponent(amount) {
    this.get('stats').trackHealing(amount);
    this.set('opponent_life', this.get('opponent_life') + amount);
  },
  harmOpponent(amount) {
    this.get('stats').trackDamage(amount);
    this.set('opponent_life', this.get('opponent_life') - amount);
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
  creatureRivalDesert(target) {
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
      this.creatureRivalDesert(target - 1);
    }
  },
  creatureAllyDesert(target) {
    if (target === 0) {
      return;
    }
    var index = this.get('player_creatures').indexOf(target);
    if (index !== -1) {
      this.get('player_creatures').removeAt(index);
      this.get('player_creatures').pushObject(0);
      this.set('player_creatures', this.get('player_creatures').sort((a,b)=>{return b-a;}));
    }
    else { // no creatures of that strength exist, try one lower
      this.creatureAllyDesert(target - 1);
    }
  },
  rollAllDice() {
    this.get('player.player_dice').forEach((dice) => {
      var total_sides = dice.neutral_sides + dice.school_sides + dice.crit_sides;
      var roll = Math.ceil(Math.random() * total_sides);
      if (roll <= dice.neutral_sides) {
        // give neutral mana
        this.addNeutralMana(roll);
        this.get('info').addNeutralManaInfoMessage(dice.dice_school, roll);
      } else if (roll > total_sides - dice.crit_sides) {
        // critical roll scored
        switch (dice.dice_school) {
          case 'life':
            this.healPlayer(2);
            break;
          case 'death':
            this.harmOpponent(2);
            break;
          case 'phys':
            // Add two 1 strength creatures
            this.addCreatureAlly(1);
            this.addCreatureAlly(1);
            break;
          case 'illusion':
            this.set('player_counterspell_tokens', this.get('player_counterspell_tokens') + 1);
            break;
          default:
        }
        this.get('info').addCritInfoMessage(dice.dice_school);
      } else {
        // give school mana
        var amount = roll - dice.neutral_sides;
        this.addSchoolMana(dice.dice_school, amount);
        this.get('info').addSchoolManaInfoMessage(dice.dice_school, amount);
      }
    });
    this.get('opponent').rollAllRivalDice();
  },
  resolveCombat() {
    // TODO trigger precombat stuff
    // let opponent drain their mana pool
    this.get('opponent').castAllRivalSpell();

    // Convert all remaining counterspell tokens into strenght 0 creatures
    if (this.get('player_counterspell_tokens') > 0) {
      this.get('player_creatures').pushObjects(Array(this.get('player_counterspell_tokens')).fill(0));
      this.set('player_counterspell_tokens', 0);
    }
    if (this.get('opponent_counterspell_tokens') > 0) {
      this.get('opponent_creatures').pushObjects(Array(this.get('opponent_counterspell_tokens')).fill(0));
      this.set('opponent_counterspell_tokens', 0);
    }

    // First, find out who has more creatures;
    let playerHasMoreCreatures = (this.get('player_creatures').length >= this.get('opponent_creatures').length);

    // Sort creatures such that larger arrray desc; smaller ascend
    let largerCreatureList;
    let smallerCreatureList;
    if (playerHasMoreCreatures) {
      largerCreatureList = this.get('player_creatures');
      smallerCreatureList = this.get('opponent_creatures');
    } else {
      largerCreatureList = this.get('opponent_creatures');
      smallerCreatureList = this.get('player_creatures');
    }
    largerCreatureList.sort((a,b)=>{return b-a;});
    smallerCreatureList.sort((a,b)=>{return a-b;});

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
      this.get('info').addPerishedCreaturesInfoMessage(defeatedCreatures);
    }
    // Deal damage to player with least creatures from unblocked
    var damage = 0;
    for (var j=smallerCreatureList.length; j<largerCreatureList.length; j++) {
      damage += largerCreatureList[j];
    }
    if(playerHasMoreCreatures) {
      this.harmOpponent(damage);
      this.get('info').addFaceDamageInfoMessage(false, damage);
      this.set('player_creatures', largerCreatureList);
      this.set('opponent_creatures', smallerCreatureList);
    } else {
      this.harmPlayer(damage);
      this.get('info').addFaceDamageInfoMessage(true, damage);
      this.set('opponent_creatures', largerCreatureList);
      this.set('player_creatures', smallerCreatureList);
    }

    // Remove dead creatures & sort
    this.set('player_creatures', this.get('player_creatures').sort((a,b)=>{return b-a;}));
    this.set('opponent_creatures', this.get('opponent_creatures').sort((a,b)=>{return b-a;}));

    this.get('player_creatures').removeObject(0);
    this.get('opponent_creatures').removeObject(0);

    this.get('info').showCombatMessages();
  },
  endTurn() {
    // Clean out any unspent mana
    this.set('player_mana.life', 0);
    this.set('player_mana.phys', 0);
    this.set('player_mana.illusion', 0);
    this.set('player_mana.death', 0);
    if (this.get('player_mana.neutral') > this.get('player.max_life')) {
      this.set('player_mana.neutral', this.get('player.max_life'));
    }
    this.get('opponent').clearRivalMana();

    // Deal with overheal
    if (this.get('player_life') > this.get('player.max_life')) {
      let hpDiffPlayer = this.get('player_life') - this.get('player.max_life');
      this.set('player_life', this.get('player_life') - Math.ceil(0.25 * hpDiffPlayer));
    }
    if (this.get('opponent_life') > this.get('player.max_life')) {
      let hpDiffRival = this.get('opponent_life') - this.get('player.max_life');
      this.set('opponent_life', this.get('opponent_life') - Math.ceil(0.25 * hpDiffRival));
    }

    // Trigger new turn
    this.get('stats').incrementTurn();
    this.get('info').showNewTurnStats();
  }

});
