import Ember from 'ember';

export default Ember.Route.extend({

  player: Ember.inject.service('player'),

  model() {
    this.get('player').loadPlayer();
    return { player: this.get('player') };
  }
});
