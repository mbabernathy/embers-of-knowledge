import Ember from 'ember';

export default Ember.Component.extend({
  game: Ember.inject.service('game'),
  chosenSchool: null,
  classNames:['spell-listing'],
  spellList: Ember.computed('chosenSchool', function() {
    var gameService = this.get('game');
    switch (this.get('chosenSchool')) {
      case 'life':
        return [{
          name: 'Minor Heal',
          cost: {
            life: 1
          },
          effect: () => {gameService.healPlayer(1);}
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
