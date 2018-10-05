import Ember from 'ember';

export default Ember.Service.extend({
  life_spells: [{
    id: '1-00',
    name: 'Minor Heal',
    buyCost: 0,
    cost: {
      life: 1
    },
    effects: {
      healPlayer: 1
    }
  }],
  bard_spells: [],
  illusion_spells: [{
    id: '3-00',
    name: 'Make love not war',
    buyCost: 0,
    cost: {
      illusion: 1
    },
    effects: {
      desert: 1
    }
  }],
  sorcery_spells: [],
  death_spells: [{
    id: '5-00',
    name: 'Minor Hurt',
    buyCost: 0,
    cost: {
      death: 1
    },
    effects: {
      harmOpponent: 1
    }
  }],
  summon_spells: [],
  phys_spells: [{
    id: '7-00',
    name: 'Create Mini-Golem',
    buyCost: 0,
    cost: {
      phys: 1
    },
    effects: {
      addCreature: 1
    }
  }],
  druid_spells: [{
    id: '8-00',
    name: 'Summon Bear',
    buyCost: 10,
    cost: {
      life: 1,
      phys: 1
    },
    effects: {
      addCreature: 2
    }
  }],
  neutral_spells: [{
    id: '0-00',
    name: 'Create Decoy',
    buyCost: 0,
    cost: {
      neutral: 2
    },
    effects: {
      addCreature: 0
    }
  }],

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
