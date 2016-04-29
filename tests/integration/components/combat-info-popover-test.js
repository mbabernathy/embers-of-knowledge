import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('combat-info-popover', 'Integration | Component | combat info popover', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{combat-info-popover}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#combat-info-popover}}
      template block text
    {{/combat-info-popover}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
