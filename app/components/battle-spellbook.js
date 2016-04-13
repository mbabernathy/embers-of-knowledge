import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  spellList: Ember.computed('game.chosenSchool', function() {
    switch (this.get('game.chosenSchool')) {
      case 'life':
        return [{
          name: 'Minor Heal',
          cost: {
            life: 1
          },
          effect: () => {this.get('game').healPlayer(1);}
        }];
/*      case 'neutral':
      case 'bard':
      case 'illusion':
      case 'sorcery':
      case 'death':
      case 'summon':
      case 'phys':
      case 'druid':*/
      default:
        return [];
    }
  })
});
