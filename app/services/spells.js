import Ember from 'ember';

export default Ember.Service.extend({
  life_spells: [{
    name: 'Minor Heal',
    cost: {
      life: 1
    },
    effects: {
      healPlayer: 1
    }
  }],
  bard_spells: [],
  illusion_spells: [],
  sorcery_spells: [],
  death_spells: [{
    name: 'Minor Hurt',
    cost: {
      death: 1
    },
    effects: {
      harmOpponent: 1
    }
  }],
  summon_spells: [],
  phys_spells: [{
    name: 'Create Mini-Golem',
    cost: {
      phys: 1
    },
    effects: {
      addCreature: 1
    }
  }],
  druid_spells: [],
  neutral_spells: [],

  getKnownSchoolSpells(school) {
    switch (school) {
      case 'life':
        return this.get('life_spells');
      case 'bard':
        return this.get('bard_spells');
      case 'illusion':
        return this.get('illusion_spells');
      case 'sorcery':
        return this.get('sorcery_spells');
      case 'death':
        return this.get('death_spells');
      case 'summon':
        return this.get('summon_spells');
      case 'phys':
        return this.get('phys_spells');
      case 'druid':
        return this.get('druid_spells');
      case 'neutral':
        return this.get('neutral_spells');
      default:
        return [];
    }
  }
});
