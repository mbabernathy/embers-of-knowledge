import Ember from 'ember';

export default Ember.Helper.extend({
  compute(params, hash) {
    let result = params[0] * params[1];
    return `${result}`;
  }
});
