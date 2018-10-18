import Ember from 'ember';

export default Ember.Service.extend({
  game: Ember.inject.service('game'),
  stats: Ember.inject.service('stats'),
  player: Ember.inject.service('player'),
  info: Ember.inject.service('info'),

  opponent_mana_actual: {
    neutral: 0,
    life: 0,
    phys: 0,
    illusion: 0,
    death: 0,
  },
  opponent_dice: [],
  clearRivalMana() {
    this.set('opponent_mana_actual.neutral', 0);
    this.set('opponent_mana_actual.life', 0);
    this.set('opponent_mana_actual.phys', 0);
    this.set('opponent_mana_actual.illusion', 0);
    this.set('opponent_mana_actual.death', 0);
  },
  setupRivalForMatch() {
    // Reset mana
    this.clearRivalMana();

    // Copy player dice, but change dice schools
    let newRivalDice = [];
    this.get('player.player_dice').forEach((dice) => {
      let newSchool = '';
      switch (dice.dice_school) {
        case 'life':
          newSchool = 'death';
          break;
        case 'death':
          newSchool = 'life';
          break;
        case 'phys':
          newSchool = 'illusion';
          break;
        case 'illusion':
          newSchool = 'phys';
          break;
        default:
      }
      newRivalDice.pushObject(Ember.Object.create({
        dice_school : newSchool,
        neutral_sides : dice.neutral_sides,
        school_sides : dice.school_sides,
        crit_sides : dice.crit_sides
      }));
    });
    this.set('opponent_dice', newRivalDice);
  },
  addRivalNeutralMana(amount) {
    this.get('stats').trackManaGained(amount);
    this.set('opponent_mana_actual.neutral', this.get('opponent_mana_actual.neutral') + amount);
  },
  addRivalSchoolMana(school, amount) {
    this.get('stats').trackManaGained(amount);
    switch (school) {
      case 'life':
        this.set('opponent_mana_actual.life', this.get('opponent_mana_actual.life') + amount);
        break;
      case 'phys':
        this.set('opponent_mana_actual.phys', this.get('opponent_mana_actual.phys') + amount);
        break;
      case 'illusion':
        this.set('opponent_mana_actual.illusion', this.get('opponent_mana_actual.illusion') + amount);
        break;
      case 'death':
        this.set('opponent_mana_actual.death', this.get('opponent_mana_actual.death') + amount);
        break;
      default:

    }
  },
  rollAllRivalDice() {
    this.get('opponent_dice').forEach((dice) => {
      var total_sides = dice.neutral_sides + dice.school_sides + dice.crit_sides;
      var roll = Math.ceil(Math.random() * total_sides);
      if (roll <= dice.neutral_sides) {
        // give neutral mana
        this.addRivalNeutralMana(roll);
      } else if (roll > total_sides - dice.crit_sides) {
        // critical roll scored
        this.get('info').addOpponentDiceCritMessage(dice.dice_school);
        switch (dice.dice_school) {
          case 'life':
            this.get('game').healOpponent(2);
            break;
          case 'death':
            this.get('game').harmPlayer(2);
            break;
          case 'phys':
            // Add two 1 strength creatures
            this.get('game').addCreatureRival(1);
            this.get('game').addCreatureRival(1);
            break;
          case 'illusion':
            this.set('game.opponent_counterspell_tokens', this.get('game.opponent_counterspell_tokens') + 1);
            break;
          default:
        }
      } else {
        // give school mana
        var amount = roll - dice.neutral_sides;
        this.addRivalSchoolMana(dice.dice_school, amount);
      }
    });
  },
  checkCounterspell() {
    if (this.get('game.player_counterspell_tokens') > 0) {
      this.set('game.player_counterspell_tokens', this.get('game.player_counterspell_tokens') -1);
      this.get('info').addOpponentSpellCounteredMessage();
      return true;
    }
    return false;
  },
  castRivalSpell() {
    // Trivial AI, just cast the basic spells until you run out of mana
    if (this.get('opponent_mana_actual.life') > 0) {
      this.set('opponent_mana_actual.life', this.get('opponent_mana_actual.life')-1);
      this.get('stats').trackSpellCast({life:1});
      if (!this.checkCounterspell()) {
        this.get('game').healOpponent(1);
        this.get('info').addOpponentSpellMessage('Minor Heal','they gained 1 health');
      }
      return;
    }
    if (this.get('opponent_mana_actual.death') > 0) {
      this.set('opponent_mana_actual.death', this.get('opponent_mana_actual.death')-1);
      this.get('stats').trackSpellCast({death:1});
      if (!this.checkCounterspell()) {
        let actualDmg = this.get('game').harmPlayer(1);
        this.get('info').addOpponentSpellMessage('Minor Hurt','you lost '+actualDmg+' health! How rude!');
      }
      return;
    }
    if (this.get('opponent_mana_actual.phys') > 0) {
      this.set('opponent_mana_actual.phys', this.get('opponent_mana_actual.phys')-1);
      this.get('stats').trackSpellCast({phys:1});
      if (!this.checkCounterspell()) {
        this.get('game').addCreatureRival(1);
        this.get('info').addOpponentSpellMessage('Create Mini-Golem','a 1 strength creature joined the opponent\'s side');
      }
      return;
    }
    if (this.get('opponent_mana_actual.illusion') > 0) {
      this.set('opponent_mana_actual.illusion', this.get('opponent_mana_actual.illusion')-1);
      this.get('stats').trackSpellCast({illusion:1});
      if (!this.checkCounterspell()) {
        this.get('game').creatureAllyDesert(1);
        this.get('info').addOpponentSpellMessage('Make love not war','one of your 1 strength creatures now refuses to fight! Lazy bum!');
      }
      return;
    }
    if (this.get('opponent_mana_actual.neutral') > 1) {
      this.set('opponent_mana_actual.neutral', this.get('opponent_mana_actual.neutral')-2);
      this.get('stats').trackSpellCast({neutral:2});
      if (!this.checkCounterspell()) {
        this.get('game').addCreatureRival(0);
        this.get('info').addOpponentSpellMessage('Create Decoy','a 0 strength decoy was created on the opponent\'s side');
      }
      return;
    }
  },
  castAllRivalSpell() {
    while (this.get('opponent_mana_actual.life') + this.get('opponent_mana_actual.death') +
           this.get('opponent_mana_actual.phys') + this.get('opponent_mana_actual.illusion') > 0) {
             this.castRivalSpell();
           }
  }
});
