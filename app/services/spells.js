import Ember from 'ember';

export default Ember.Service.extend({
  life_spells: [{
    id: '1-00',
    name: 'Minor Heal',
    description: 'Heal 1 damage on yourself',
    buyCost: 0,
    cost: {
      life: 1
    },
    effects: {
      healPlayer: 1
    }
  }, {
    id: '1-01',
    name: 'Aura of Protection',
    description: 'Reduce damage dealt to you by 1 (counters effects of damage curses)',
    buyCost: 100,
    cost: {
      life: 2,
      neutral: 1
    },
    effects: {
      protectPlayer: 1
    }
  }],
  bard_spells: [{
    id: '2-00',
    name: 'Song and Dance',
    description: 'All creatures will dance, skipping the creature combat phase this turn',
    buyCost: 50,
    cost: {
      life: 1,
      illusion: 1,
      neutral: 1
    },
    effects: {
      skipCombat: 1
    }
  }],
  illusion_spells: [{
    id: '3-00',
    name: 'Make love not war',
    description: 'Convice opposing strength 1 creature to not fight (converts it into 0 strength creature)',
    buyCost: 0,
    cost: {
      illusion: 1
    },
    effects: {
      desert: 1
    }
  }],
  sorcery_spells: [{
    id: '4-00',
    name: 'Fire spray',
    description: 'Destroys 2 creatures of strength 1 (or less)',
    buyCost: 50,
    cost: {
      illusion: 1,
      death: 1
    },
    effects: {
      massDestroy: {
        number: 2,
        strength: 1
      }
    }
  }, {
    id: '4-01',
    name: 'Ice spear',
    description: 'Destroys a single creature of strength 2 (or less)',
    buyCost: 100,
    cost: {
      illusion: 1,
      death: 1,
      neutral: 1
    },
    effects: {
      destroyCreature: 2
    }
  }],
  death_spells: [{
    id: '5-00',
    name: 'Minor Hurt',
    description: 'Deal 1 damage to opponent',
    buyCost: 0,
    cost: {
      death: 1
    },
    effects: {
      harmOpponent: 1
    }
  }, {
    id: '5-01',
    name: 'Curse of Harming',
    description: 'Increase damage dealt to oppontent by 1 (counters effects of protection auras)',
    buyCost: 100,
    cost: {
      death: 2,
      neutral: 1
    },
    effects: {
      curseRival: 1
    }
  }, {
    id: '5-02',
    name: 'Necrotic Decay',
    description: 'Weaken target creature by 1',
    buyCost: 100,
    cost: {
      death: 2
    },
    effects: {
      decayTarget: 1
    }
  }],
  summon_spells: [{
    id: '6-00',
    name: 'Summon Imps',
    description: 'Summon 2 creatures of strength 1',
    buyCost: 50,
    cost: {
      phys: 1,
      death: 1
    },
    effects: {
      massSummon: {
        number: 2,
        strength: 1
      }
    }
  }],
  phys_spells: [{
    id: '7-00',
    name: 'Create Mini-Golem',
    description: 'Summon creature of strength 1',
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
    description: 'Summon creature of strength 2',
    buyCost: 50,
    cost: {
      life: 1,
      phys: 1
    },
    effects: {
      addCreature: 2
    }
  }, {
    id: '8-01',
    name: 'Druidic Growth',
    description: 'Strengthen target creature by 1',
    buyCost: 200,
    cost: {
      life: 2,
      phys: 1,
      neutral: 1
    },
    effects: {
      buffTarget: 1
    }
  }],
  neutral_spells: [{
    id: '0-00',
    name: 'Create Decoy',
    description: 'Summon temporary creature of strength 0',
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
