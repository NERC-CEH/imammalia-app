/* eslint-disable @getify/proper-arrows/name */

/* eslint-disable no-param-reassign */

/* eslint-disable camelcase */
import bg from './interface/bg_BG.po';
import cz from './interface/cs_CZ.po';
import de from './interface/de_DE.po';
import el from './interface/el_GR.po';
import en from './interface/en.pot';
import es from './interface/es_ES.po';
import fr from './interface/fr_FR.po';
import hr from './interface/hr_HR.po';
import it from './interface/it_IT.po';
import lt from './interface/lt_LT.po';
import mk from './interface/mk_MK.po';
import no from './interface/no_NO.po';
import pl from './interface/pl_PL.po';
import pt from './interface/pt_PT.po';
import sk from './interface/sk_SK.po';
import sq from './interface/sq_AL.po';
import sr from './interface/sr_ME.po';
import rs from './interface/sr_RS.po';
import uk from './interface/uk_UA.po';

const rawToKeyVal = lang =>
  Object.entries(lang).reduce((agg, pair) => {
    const [key, translation] = pair;
    // console.log(pair);
    if (!key) {
      return agg;
    }

    const [, val, ...pluralVals] = translation;
    if (!val) {
      return agg;
    }

    if (pluralVals.length) {
      const pluralValsWrap = (plural, index) => {
        agg[`${key}_${index + 1}`] = plural;
      };

      pluralVals.forEach(pluralValsWrap);
    }

    agg[key] = val; // eslint-disable-line no-param-reassign
    return agg;
  }, {});

export default {
  en: {
    interface: rawToKeyVal(en),
  },
  lt: {
    interface: rawToKeyVal(lt),
  },
  de: {
    interface: rawToKeyVal(de),
  },
  bg: {
    interface: rawToKeyVal(bg),
  },
  cz: {
    interface: rawToKeyVal(cz),
  },
  el: {
    interface: rawToKeyVal(el),
  },
  es: {
    interface: rawToKeyVal(es),
  },
  fr: {
    interface: rawToKeyVal(fr),
  },
  hr: {
    interface: rawToKeyVal(hr),
  },
  it: {
    interface: rawToKeyVal(it),
  },
  mk: {
    interface: rawToKeyVal(mk),
  },
  no: {
    interface: rawToKeyVal(no),
  },
  pl: {
    interface: rawToKeyVal(pl),
  },
  pt: {
    interface: rawToKeyVal(pt),
  },
  sk: {
    interface: rawToKeyVal(sk),
  },
  sq: {
    interface: rawToKeyVal(sq),
  },
  sr: {
    interface: rawToKeyVal(sr),
  },
  rs: {
    interface: rawToKeyVal(rs),
  },
  uk: {
    interface: rawToKeyVal(uk),
  },
};
