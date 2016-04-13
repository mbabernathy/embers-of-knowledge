import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('battle-spellbook', 'Integration | Component | battle spellbook', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{battle-spellbook}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#battle-spellbook}}
      template block text
    {{/battle-spellbook}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
