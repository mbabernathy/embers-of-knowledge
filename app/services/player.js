import Ember from 'ember';

export default Ember.Service.extend({
  game: Ember.inject.service('game'),
  stats: Ember.inject.service('stats'),
  max_life: 0,
  player_money: 0,
  player_dice: [],
  knownSpells: [],
  isBattling: false,

  resetDefaultPlayer() {
    this.set('max_life', 5);
    this.set('player_money', 0);
    this.set('knownSpells', ['0-00', '1-00', '3-00', '5-00', '7-00']);
    let playerDice = [];
    ['life','phys','illusion','death'].forEach((schoolString) => {
      playerDice.pushObject(Ember.Object.create({
        dice_school : schoolString,
        neutral_sides : 1,
        school_sides : 1,
        crit_sides : 1
      }))
    });
    this.set('player_dice', playerDice);
    this.set('isBattling', true);
  },

  loadPlayer() {
    try {
      let playerObject = JSON.parse(window.localStorage.getItem('player'));
      if (!playerObject) {
        throw "loading playerstate error";
      }
      this.set('max_life', playerObject.max_life);
      this.set('player_money', playerObject.player_money);
      this.set('knownSpells', playerObject.knownSpells);
      let playerDice = [];
      playerObject.player_dice.forEach((dice) => {
        playerDice.pushObject(Ember.Object.create({
          dice_school : dice.dice_school,
          neutral_sides : dice.neutral_sides,
          school_sides : dice.school_sides,
          crit_sides : dice.crit_sides
        }));
      });
      this.set('player_dice', playerDice);
      this.set('isBattling', false);
    } catch (e) {
      this.resetDefaultPlayer();
    }
  },
  savePlayer() {
    let playerObject = {
      max_life: this.get('max_life'),
      player_money: this.get('player_money'),
      knownSpells: this.get('knownSpells'),
      player_dice: this.get('player_dice')
    };
    window.localStorage.setItem('player', JSON.stringify(playerObject));
  },

  endBattlePhase() {
    this.set('player_money', this.get('player_money') + this.get('stats.expectedIncome'));

    // Switch out of battleframe
    this.set('isBattling', false);
    this.savePlayer();
  },

  startNewBattle() {
    this.set('isBattling', true);
    this.get('game').createNewBattle();
  },

  spendMoney(amount) {
    this.set('player_money', this.get('player_money') - amount);
  },

  costFunction(step) {
    const costArray = [1, 2, 5];
    let cost = Math.pow(10, (parseInt(step / 3))) * (costArray[step % 3]);
    return cost;
  },

  costForDiceSide(dice) {
    let totalSides = dice.neutral_sides + dice.school_sides + dice.crit_sides;
    return this.costFunction(totalSides);
  },

  upgradeDiceNeutralSide(dice) {
    let cost = this.costForDiceSide(dice);
    if (this.get('player_money') < cost) {
      return;
    }
    this.spendMoney(cost);
    dice.set('neutral_sides', dice.get('neutral_sides') + 1);
  },

  upgradeDiceSchoolSide(dice) {
    let cost = this.costForDiceSide(dice);
    if (this.get('player_money') < cost) {
      return;
    }
    this.spendMoney(cost);
    dice.set('school_sides', dice.get('school_sides') + 1);
  },

  upgradeDiceCritSide(dice) {
    let cost = this.costForDiceSide(dice);
    if (this.get('player_money') < cost) {
      return;
    }
    this.spendMoney(cost);
    dice.set('crit_sides', dice.get('crit_sides') + 1);
  },

  buySpell(spell) {
    // make sure not already known
    if (this.get('knownSpells').includes(spell.id)) {
      return;
    }
    // check sufficient money
    if (this.get('player_money') < spell.buyCost) {
      return;
    }
    // do the transaction
    this.spendMoney(spell.buyCost);
    this.get('knownSpells').pushObject(spell.id);
  }
});
