/* eslint-disable camelcase */
import appModel from 'app_model';
import en from '../translations/en.pot';
import de_DE from '../translations/de_DE.po';
import es_ES from '../translations/es_ES.po';
import hr_HR from '../translations/hr_HR.po';
import pl_PL from '../translations/pl_PL.po';

const dictionary = {
  en,
  de_DE,
  es_ES,
  hr_HR,
  pl_PL,
};

export const languages = {
  en: 'English',
  de_DE: 'Deutsch',
  es_ES: 'Español',
  hr_HR: 'Hrvatski',
  pl_PL: 'Polski',
};

export const countries = {
  DE: 'Germany',
  ES: 'Spain',
  HR: 'Croatia',
  PL: 'Poland',
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
