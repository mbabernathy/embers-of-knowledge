import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('diceroll-info-popover', 'Integration | Component | diceroll info popover', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{diceroll-info-popover}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#diceroll-info-popover}}
      template block text
    {{/diceroll-info-popover}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
