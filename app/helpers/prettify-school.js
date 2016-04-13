import Ember from 'ember';

export function prettifySchool(params) {
  switch (params[0]) {
    case 'neutral':
      return 'Neutral';
    case 'life':
      return 'Life';
    case 'bard':
      return 'Bardic';
    case 'illusion':
      return 'Illusion';
    case 'sorcery':
      return 'Sorcery';
    case 'death':
      return 'Death';
    case 'summon':
      return 'Summoning';
    case 'phys':
      return 'Physical';
    case 'druid':
      return 'Druidic';
    default:
      return 'Unknown';
  }
}

export default Ember.Helper.helper(prettifySchool);
