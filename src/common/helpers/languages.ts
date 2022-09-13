import { isPlatform } from '@ionic/react';

const demoOnly = !isPlatform('hybrid');

const languages = {
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

export default languages;
