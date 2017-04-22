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
      this.get('player').upgradeDiceNeutralSide(this.get('dice'));
    },
    buySchoolSide() {
      this.get('player').upgradeDiceSchoolSide(this.get('dice'));
    },
    buyCritSide() {
      this.get('player').upgradeDiceCritSide(this.get('dice'));
    }
  }
});
