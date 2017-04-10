import Ember from 'ember';

export default Ember.Route.extend({

  player: Ember.inject.service('player'),

  model() {
    return { player: this.get('player') };
  }
});
