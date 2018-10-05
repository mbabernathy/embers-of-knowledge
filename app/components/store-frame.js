import Ember from 'ember';

export default Ember.Component.extend({
  player: Ember.inject.service('player'),
  chosenStoreSchool: 'neutral',
  actions: {
    gotoBattle() {
      this.get('player').startNewBattle();
    },
    setStoreSchool(chosenSchool) {
      this.set('chosenStoreSchool', chosenSchool);
    },
    buySpell(spell) {
      this.get('player').buySpell(spell);
    }
  }
});
