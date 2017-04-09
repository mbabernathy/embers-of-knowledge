import Ember from 'ember';

export function prettifySchool(rawSchool) {
  switch (rawSchool) {
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

export default Ember.Helper.extend({
  compute(params) {
    return prettifySchool(params[0])
  }
});
