/* eslint-disable camelcase */
import appModel from 'app_model';
import en from '../translations/en.pot';
import de_DE from '../translations/de_DE.po';
import es_ES from '../translations/es_ES.po';
import hr_HR from '../translations/hr_HR.po';
import pl_PL from '../translations/pl_PL.po';
import mk_MK from '../translations/mk_MK.po';
import sr_RS from '../translations/sr_RS.po';

// Adding some context, reference and other in po files:

// #: Some reference!!
// msgctxt "this is my context!!!!"
// msgid "Select your country"
// msgid_plural "plural!!!"
// msgstr[0] "Selecciona tu pais"
// msgstr[1] ""

const dictionary = {
  en,
  de_DE,
  es_ES,
  hr_HR,
  pl_PL,
  mk_MK,
  sr_RS,
};

export const languages = {
  en: 'English',
  de_DE: 'Deutsch',
  es_ES: 'Español',
  hr_HR: 'Hrvatski',
  pl_PL: 'Polski',
  mk_MK: 'Mакедонски',
  sr_RS: 'Cрпски',
};

export const countries = {
  AL: 'Albania',
  AT: 'Austria',
  BY: 'Belarus',
  BE: 'Belgium',
  BA: 'Bosnia and Herzegovina',
  BG: 'Bulgaria',
  HR: 'Croatia',
  CZ: 'Czechia',
  EE: 'Estonia',
  FI: 'Finland',
  FR: 'France',
  DE: 'Germany',
  GR: 'Greece',
  HU: 'Hungary',
  IS: 'Iceland',
  IE: 'Ireland',
  IT: 'Italy',
  XK: 'Kosovo',
  LV: 'Latvia',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MK: 'North Macedonia',
  MT: 'Malta',
  MD: 'Moldova',
  ME: 'Montenegro',
  NL: 'Netherlands',
  NO: 'Norway',
  PL: 'Poland',
  PT: 'Portugal',
  RO: 'Romania',
  RS: 'Serbia',
  SK: 'Slovakia',
  SI: 'Slovenia',
  ES: 'Spain',
  SE: 'Sweden',
  CH: 'Switzerland',
  TR: 'Turkey',
  UA: 'Ukraine',
  UK: 'United Kingdom',

  // special option
  ELSEWHERE: 'Elsewhere',
};

function translate(key) {
  const language = appModel.get('language');

  const translation = dictionary[language][key];
  if (!translation) {
    window.dic = window.dic || [];
    if (!window.dic.includes(key)) {
      window.dic.push(key);
      console.log(`!new: ${key}`); // todo: remove
      // all='';dic.forEach(word => {all+=`\nmsgid "${word}"\nmsgstr "${word}"\n`})
    }
    return key;
  }

  if (!translation) {
    return key;
  }

  return translation;
}

window.t = translate;

export default translate;
