/* eslint-disable @getify/proper-arrows/name */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import en from './interface/en.pot';
import lt from './interface/lt_LT.po';
import de from './interface/de_DE.po';

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
};
