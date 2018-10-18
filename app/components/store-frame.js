import Ember from 'ember';

export default Ember.Component.extend({
  player: Ember.inject.service('player'),
  chosenStoreSchool: 'neutral',
  newDiceCost: Ember.computed('player.player_dice.[]', function() {
    return this.get('player').costForNewDice();
  }),
  cantAffordDice: Ember.computed('player.player_money', 'newDiceCost', function() {
    return this.get('player.player_money') < this.get('newDiceCost');
  }),
  leagueUpgrageCost: Ember.computed('player.max_life', function() {
    return this.get('player').costForLeagueUpgrade();
  }),
  cantAffordLeague: Ember.computed('player.player_money', 'leagueUpgrageCost', function() {
    return this.get('player.player_money') < this.get('leagueUpgrageCost');
  }),
  actions: {
    gotoBattle() {
      this.get('player').startNewBattle();
    },
    setStoreSchool(chosenSchool) {
      this.set('chosenStoreSchool', chosenSchool);
    },
    buySpell(spell) {
      this.get('player').buySpell(spell);
    },
    buyNewLifeDice() {
      this.get('player').buyNewDice('life');
    },
    buyNewPhysDice() {
      this.get('player').buyNewDice('phys');
    },
    buyNewIllusionDice() {
      this.get('player').buyNewDice('illusion');
    },
    buyNewDeathDice() {
      this.get('player').buyNewDice('death');
    },
    buyLeaugeUpgrade() {
      this.get('player').upgradeLeague();
    }
  }
});
