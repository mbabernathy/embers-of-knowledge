import Ember from 'ember';

export default Ember.Component.extend({

  newSideCost: Ember.computed('dice.{neutral_sides,school_sides,crit_sides}', function() {
    return this.get('player').costForDiceSide(this.get('dice'));
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
