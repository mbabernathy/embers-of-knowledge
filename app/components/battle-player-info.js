import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['manaflexbox'],
  game: Ember.inject.service('game')
});
