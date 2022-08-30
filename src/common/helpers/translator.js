/* eslint-disable camelcase */
import i18n from 'i18next';
import appModel from 'app_model';
import { isPlatform } from '@ionic/react';
import en from '../translations/en.pot';
import de_DE from '../translations/de_DE.po';
import es_ES from '../translations/es_ES.po';
import hr_HR from '../translations/hr_HR.po';
import pl_PL from '../translations/pl_PL.po';
import mk_MK from '../translations/mk_MK.po';
import sr_RS from '../translations/sr_RS.po';
import sq_AL from '../translations/sq_AL.po';
import it_IT from '../translations/it_IT.po';
import bg_BG from '../translations/bg_BG.po';
import lt_LT from '../translations/lt_LT.po';
import el_GR from '../translations/el_GR.po';
import sr_ME from '../translations/sr_ME.po';
import pt_PT from '../translations/pt_PT.po';
import cs_CZ from '../translations/cs_CZ.po';
import fr_FR from '../translations/fr_FR.po';
import no_NO from '../translations/no_NO.po';
import sk_SK from '../translations/sk_SK.po';
import uk_UA from '../translations/uk_UA.po';

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
  sq_AL,
  it_IT,
  bg_BG,
  lt_LT,
  el_GR,
  sr_ME,
  pt_PT,
  cs_CZ,
  fr_FR,
  no_NO,
  sk_SK,
  uk_UA,
};

// for incomplete languages only shown in the app demo website
const demoOnly = !isPlatform('hybrid');

export const languages = {
  en: 'English',
  de_DE: 'Deutsch',
  es_ES: 'Español',
  hr_HR: 'Hrvatski',
  pl_PL: 'Polski',
  mk_MK: 'Mакедонски',
  sr_RS: 'Cрпски',
  sq_AL: 'Shqip',
  it_IT: 'Italiano',
  bg_BG: demoOnly && 'Български',
  lt_LT: demoOnly && 'Lietuvių',
  el_GR: 'Ελληνικά',
  sr_ME: 'Crnogorski',
  pt_PT: 'Português',
  cs_CZ: 'Čeština',
  fr_FR: 'Français',
  no_NO: 'Norsk',
  sk_SK: 'Slovenčina',
  uk_UA: 'Українська',
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

function translate(key, isSpeciesDescription, isSpeciesName) {
  if (isSpeciesName) {
    return i18n.t(key, {
      ns: 'names',
      lngs: [i18n.language], // don't revert to english if no local species name
      defaultValue: '', // don't return anything if no local species name
    });
  }

  if (isSpeciesDescription) {
    // revert to English descriptions
    let translation = i18n.t(key, { ns: 'species' });
    if (!translation) {
      translation = i18n.t(key, { ns: 'species', lng: 'en' });
    }
    return translation !== key ? translation : null;
  }

  return i18n.t(key);
}

// import species from 'common/data/species.data.json';

// console.log(
//   JSON.stringify(
//     species.map(({ english, warehouse_id, taxon }) => {
//       const sp = { commonName: english, warehouse_id, scientificName: taxon };
//       Object.keys(languages).forEach(lang => {
//         if (lang === 'en') return;
//         sp[lang] = translate(english, lang);
//       });

//       return sp;
//     })
//   )
// );

window.t = translate;

export default translate;
