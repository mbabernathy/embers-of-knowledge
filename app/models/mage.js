import Ember from 'ember';

export default Ember.Object.extend({
  max_life: 0,
  life: 0,
  mana: {
    neutral: 0,
    life: 0,
    phys: 0,
    illusion: 0,
    death: 0,
  },
  counterspell_tokens: 0,
  creatures: [],
  self_damage_prevention: 0,

  // Creates new mage; pass in max_life from player service
  create(max) {
    this.set('max_life', max);
    this.set('life', max);
    this.set('mana.neutral', 0);
    this.clearSchoolMana();
    this.set('counterspell_tokens', 0);
    this.set('self_damage_prevention', 0);
    this.get('creatures').clear();
  },
  // Clears school based mana, usually for end of turn stuff
  clearSchoolMana() {
    this.set('mana.life', 0);
    this.set('mana.phys', 0);
    this.set('mana.illusion', 0);
    this.set('mana.death', 0);
  },
  // Adds amount of mana of type to the mage,
  // type should be one of 'life', 'phys', 'illution', 'death', 'neutral'
  addMana(type, amount) {
    switch (school) {
      case 'life':
        this.set('mana.life', this.get('mana.life') + amount);
        break;
      case 'phys':
        this.set('mana.phys', this.get('mana.phys') + amount);
        break;
      case 'illusion':
        this.set('mana.illusion', this.get('mana.illusion') + amount);
        break;
      case 'death':
        this.set('mana.death', this.get('mana.death') + amount);
        break;
      case 'neutral':
        this.set('mana.neutral', this.get('mana.neutral') + amount);
        break;
      default:
        // TODO: Should not happen, so maybe log it?
    }
  },
  // Returns true/false if mage has requested mana of cost type or not
  canSpend(cost) {
    if (cost.life && cost.life > this.get('mana.life')) {
      return false;
    }
    if (cost.death && cost.death > this.get('mana.death')) {
      return false;
    }
    if (cost.phys && cost.phys > this.get('mana.phys')) {
      return false;
    }
    if (cost.illusion && cost.illusion > this.get('mana.illusion')) {
      return false;
    }
    if (cost.neutral && cost.neutral > this.get('mana.neutral')) {
      return false;
    }
    return true;
  },
  // Deducts requested mana; might want to use canSpend first before calling
  spendMana(cost) {
    if (cost.life) {
      this.set('mana.life', this.get('mana.life') - cost.life);
    }
    if (cost.death) {
      this.set('mana.death', this.get('mana.death') - cost.death);
    }
    if (cost.phys) {
      this.set('mana.phys', this.get('mana.phys') - cost.phys);
    }
    if (cost.illusion) {
      this.set('mana.illusion', this.get('mana.illusion') - cost.illusion);
    }
    if (cost.neutral) {
      this.set('mana.neutral', this.get('mana.neutral') - cost.neutral);
    }
  },
  // Heals damage by amount, returns amount healed
  heal(amount) {
    this.set('life', this.get('life') + amount);
    return amount;
  },
  // Damages mage by amount, returns amount damaged
  harm(amount) {
    // Damage of nothing cannot be modified up
    if (!amount) {
      return 0;
    }
    // Deal with damage modifiers, cannot be negative
    let modifiedDmg = Math.max(amount - this.get('self_damage_prevention'), 0);
    // Prevent overkill
    let actualDmg = Math.min(this.get('life'), modifiedDmg);

    this.set('life', this.get('life') - actualDmg);
    return actualDmg;
  },
  // Checks for spell counter, returns true if countered and deducts token
  checkCounteredSpell() {
    if (this.get('counterspell_tokens') > 0) {
      this.set('counterspell_tokens', this.get('counterspell_tokens') -1);
      return true;
    }
    return false;
  },
  // Adds creature of strength
  addCreature(strength) {
    this.get('creatures').pushObject(strength);
  },
  // Removes creature of strength, returns strength of creature actually removed, or -1 for nothing
  removeCreature(strength) {
    if (strength === -1) {
      return -1;
    }
    var index = this.get('creatures').indexOf(strength);
    if (index !== -1) {
      this.get('creatures').removeAt(index);
      return strength;
    } else {
      // No valid targets, try one strength lower
      return this.removeCreature(strength-1);
    }
  },
  // Replaces creature of strength with new strength, returns strength of creature affected, or -1 for no effect
  replaceCreature(target, newStrength) {
    if (target === newStrength || target === -1) {
      return -1;
    }
    var index = this.get('creatures').indexOf(target);
    if (index !== -1) {
      this.get('creatures').removeAt(index);
      this.get('creatures').pushObject(newStrength);
      return target;
    } else {
      // No valid targets, try one strength lower
      return this.replaceCreature(strength-1);
    }
  }
});
