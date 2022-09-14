/** ****************************************************************************
 * Main app configuration file.
 **************************************************************************** */
import Indicia from 'indicia';
// import DateHelp from 'helpers/date';

const HOST =
  process.env.APP_INDICIA_API_HOST || 'https://european-mammals.brc.ac.uk/';

const typeValues = [
  { value: 'Alive', id: 17463 },
  { value: 'Dead - roadkill', id: 17464 },
  { value: 'Dead - other', id: 17465 },
  { value: 'Hunted', id: 17780 },
  {
    value: 'Indirect',
    type: 'radio',
    values: [
      { value: 'Print/trail', id: 17466 },
      { value: 'Dropping', id: 17467 },
      { value: 'Den/burrow', id: 17468 },
      { value: 'Other (specify in Comment)', id: 17469 },
    ],
  },
];

function flattenForKeys(list) {
  return list.reduce((agg, item) => {
    if (item.values) {
      return { ...agg, ...flattenForKeys(item.values) };
    }

    return { ...agg, ...{ [item.value]: item.id } };
  }, {});
}

const isTestEnv = process.env.NODE_ENV === 'test';

const CONFIG = {
  // variables replaced on build
  version: process.env.APP_VERSION,
  build: process.env.APP_BUILD,

  environment: process.env.NODE_ENV,

  gps_accuracy_limit: 100,

  site_url: HOST,

  // use prod logging if testing otherwise full log
  log: !isTestEnv,

  sentryDNS: !isTestEnv && process.env.APP_SENTRY_KEY,

  users: {
    url: `${HOST + Indicia.API_BASE + Indicia.API_VER}/users/`,
    timeout: 80000,
  },

  reports: {
    url: `${
      HOST + Indicia.API_BASE + Indicia.API_VER + Indicia.API_REPORTS_PATH
    }`,
    timeout: 80000,
  },

  // mapping
  map: {
    mapbox_api_key: process.env.APP_MAPBOX_MAP_KEY,
    mapbox_osm_id: 'cehapps.0fenl1fe',
    mapbox_satellite_id: 'cehapps.0femh3mh',
  },

  // indicia configuration
  indicia: {
    host: HOST,
    api_key: process.env.APP_INDICIA_API_KEY,
    website_id: 122,
    id: 571,
    webForm: 'enter-app-record',
    attrs: {
      smp: {
        location: {
          values(location) {
            return `${parseFloat(location.latitude).toFixed(7)}, ${parseFloat(
              location.longitude
            ).toFixed(7)}`;
          },
        },
        device: {
          id: 922,
          values: {
            iOS: 2398,
            Android: 2399,
          },
        },
        device_version: { id: 759 },
        app_version: { id: 1139 },

        manual_location_accuracy: {
          id: 1446,
          values: {
            '0-10m': 17450,
            '10-50m': 17451,
            '50-100m': 17452,
            '100m-1km': 17453,
            '>1km': 17454,
            NA: 17455,
          },
        },

        date: {
          label: 'Date',
          // values(date) {
          // return DateHelp.print(date);
          // },?
          isValid: val => val && val.toString() !== 'Invalid Date',
          type: 'date',
          max: () => new Date(),
        },
      },
      occ: {
        training: {
          id: 'training',
        },

        taxon: {
          values(taxon) {
            return taxon.warehouse_id;
          },
        },

        number: {
          label: 'Number',
          id: 16,
        },

        'number-ranges': {
          type: 'radio',
          id: 320,
          values: {
            1: 3808,
            '2-5': 3809,
            '6-9': 38010,
            '10-19': 3811,
            '20-49': 3812,
            '50+': 3813,
          },
        },

        type: {
          label: 'Type',
          type: 'radio',
          info: 'Please specify the condition of the mammal.',
          id: 800,
          values: flattenForKeys(typeValues),
          _values: typeValues,
        },

        gender: {
          label: 'Gender',
          type: 'radio',
          info: 'Please specify the gender of the mammal.',
          id: 836,
          values: {
            Male: 17781,
            Female: 17782,
            Unknown: 17783,
          },
        },

        age: {
          label: 'Age',
          type: 'radio',
          info: 'Please specify the age of the mammal.',
          id: 824,
          values: {
            Piglet: 17687,
            Juvenile: 17688,
            Adult: 17689,
          },
        },

        decomposition: {
          label: 'Decomposition',
          type: 'radio',
          info: 'Please specify the state of decomposition of the mammal.',
          id: 825,
          values: {
            'Fresh carcass': 17690,
            Decomposed: 17691,
            'Dry (just bones left)': 17692,
          },
        },

        method: {
          label: 'Method',
          type: 'radio',
          info: 'Please specify how has this mammal been observed.',
          id: 799,
          values: {
            'Direct observation': 17456,
            'Camera trap': 17457,
            Catch: 17458,
            Hunted: 17683,
            'Road kill': 17459,
            'Field carcass': 17460,
            Telemetry: 17461,
            'Other (specify in Comment)': 17462,
          },
        },

        comment: {
          label: 'Comment',
          type: 'textarea',
        },
      },
    },
  },
};

export default CONFIG;
