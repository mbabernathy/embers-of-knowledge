import Ember from 'ember';

export default Ember.Component.extend({
  dice: null,
  player: Ember.inject.service('player'),

  newSideCost: Ember.computed('dice.{neutral_sides,school_sides,crit_sides}', function() {
    const costArray = [1, 2, 5];
    let totalSides = this.get('dice.neutral_sides') + this.get('dice.school_sides') + this.get('dice.crit_sides');
    let cost = Math.pow(10, (parseInt(totalSides / 3))) * (costArray[totalSides%3]);
    return cost;
  }),

  cantAfford: Ember.computed('player.player_money', 'newSideCost', function() {
    return this.get('player.player_money') < this.get('newSideCost');
  }),

  actions: {
    buyNeutralSide() {
      if (this.get('cantAfford')) {
        return;
      }
      this.get('player').spendMoney(this.get('newSideCost'));
      this.set('dice.neutral_sides', this.get('dice.neutral_sides') + 1);
    },
    buySchoolSide() {
      if (this.get('cantAfford')) {
        return;
      }
      this.get('player').spendMoney(this.get('newSideCost'));
      this.set('dice.school_sides', this.get('dice.school_sides') + 1);
    },
    buyCritSide() {
      if (this.get('cantAfford')) {
        return;
      }
      this.get('player').spendMoney(this.get('newSideCost'));
      this.set('dice.crit_sides', this.get('dice.crit_sides') + 1);
    }
  }
});
