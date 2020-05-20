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
  DE: 'Germany',
  ES: 'Spain',
  HR: 'Croatia',
  PL: 'Poland',
  MK: 'North Macedonia',
  RS: 'Serbia',
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
