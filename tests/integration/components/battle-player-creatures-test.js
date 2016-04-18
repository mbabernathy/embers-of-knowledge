import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('battle-player-creatures', 'Integration | Component | battle player creatures', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{battle-player-creatures}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#battle-player-creatures}}
      template block text
    {{/battle-player-creatures}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
