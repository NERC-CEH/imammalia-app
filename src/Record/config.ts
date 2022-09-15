import * as Yup from 'yup';
import { date as dateHelp } from '@flumens';
import AppOccurrence from 'models/occurrence';
import { isPlatform } from '@ionic/react';
import { chatboxOutline, calendarOutline } from 'ionicons/icons';
import config from 'common/config';
import binocularsIcon from './common/images/binoculars.svg';
import footprintIcon from './common/images/footprint.svg';
import genderIcon from './common/images/gender.svg';
import ageIcon from './common/images/age.svg';
import skullIcon from './common/images/skull.svg';

const fixedLocationSchema = Yup.object().shape({
  latitude: Yup.number().required(),
  longitude: Yup.number().required(),
});

const validateLocation = (val: any) => {
  try {
    fixedLocationSchema.validateSync(val);
    return true;
  } catch (e) {
    return false;
  }
};

const verifyLocationSchema = Yup.mixed().test(
  'location',
  'Please add record location.',
  validateLocation
);

const typeValues = [
  { value: 'Alive', id: 17463 },
  { value: 'Dead - roadkill', id: 17464 },
  { value: 'Dead - other', id: 17465 },
  { value: 'Hunted', id: 17780 },

  { isPlaceholder: true, label: 'Indirect' },

  { value: 'Print/trail', id: 17466 },
  { value: 'Dropping', id: 17467 },
  { value: 'Den/burrow', id: 17468 },
  { value: 'Other (specify in Comment)', id: 17469 },
];

const genderValues = [
  { value: 'Male', id: 17781 },
  { value: 'Female', id: 17782 },
  { value: 'Unknown', id: 17783 },
];

const ageValues = [
  { value: 'Piglet', id: 17687 },
  { value: 'Juvenile', id: 17688 },
  { value: 'Adult', id: 17689 },
];

const decompositionValues = [
  { value: 'Fresh carcass', id: 17690 },
  { value: 'Decomposed', id: 17691 },
  { value: 'Dry (just bones left)', id: 17692 },
];

const methodValues = [
  { value: 'Direct observation', id: 17456 },
  { value: 'Camera trap', id: 17457 },
  { value: 'Catch', id: 17458 },
  { value: 'Hunted', id: 17683 },
  { value: 'Road kill', id: 17459 },
  { value: 'Field carcass', id: 17460 },
  { value: 'Telemetry', id: 17461 },
  { value: 'Other (specify in Comment)', id: 17462 },
];

const numberRangesValues = [
  { value: 1, id: 3808 },
  { value: '2-5', id: 3809 },
  { value: '6-9', id: 38010 },
  { value: '10-19', id: 3811 },
  { value: '20-49', id: 3812 },
  { value: '50+', id: 3813 },
];

const manualLocationAccuracy = [
  { value: '0-10m', id: 17450 },
  { value: '10-50m', id: 17451 },
  { value: '50-100m', id: 17452 },
  { value: '100m-1km', id: 17453 },
  { value: '>1km', id: 17454 },
  { value: 'NA', id: 17455 },
];

const record = {
  id: 571,
  name: 'main',
  webForm: 'enter-app-record',

  attrs: {
    location: {
      remote: {
        id: 'entered_sref',
        values(location: any, submission: any) {
          // convert accuracy for map and gridref sources
          const {
            accuracy,
            source,
            gridref,
            altitude,
            name,
            altitudeAccuracy,
          } = location;

          // add other location related attributes
          // eslint-disable-next-line
          submission.values = { ...submission.values };

          submission.values['smpAttr:760'] = source; // eslint-disable-line
          submission.values['smpAttr:335'] = gridref; // eslint-disable-line
          submission.values['smpAttr:282'] = accuracy; // eslint-disable-line
          submission.values['smpAttr:283'] = altitude; // eslint-disable-line
          submission.values['smpAttr:284'] = altitudeAccuracy; // eslint-disable-line
          submission.values['location_name'] = name; // eslint-disable-line

          const lat = parseFloat(location.latitude);
          const lon = parseFloat(location.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lat)) {
            return null;
          }

          return `${lat.toFixed(7)}, ${lon.toFixed(7)}`;
        },
      },
    },

    date: {
      menuProps: { parse: 'date', icon: calendarOutline },
      pageProps: {
        attrProps: {
          input: 'date',
          inputProps: {
            max: () => new Date(),
            label: 'Date',
            icon: calendarOutline,
            autoFocus: false,
          },
        },
      },
      remote: { values: (date: Date) => dateHelp.print(date, false) },
    },

    manual_location_accuracy: {
      remote: { id: 1446, values: manualLocationAccuracy },
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
  },

  occ: {
    attrs: {
      taxon: {
        remote: {
          id: 'taxa_taxon_list_id',
          values: (taxon: any) => taxon.warehouse_id,
        },
      },

      method: {
        menuProps: { icon: binocularsIcon },
        pageProps: {
          attrProps: {
            input: 'radio',
            info: 'Please specify how has this mammal been observed.',
            inputProps: { options: methodValues },
          },
        },
        remote: { id: 799, values: methodValues },
      },

      type: {
        menuProps: { icon: footprintIcon },
        pageProps: {
          attrProps: {
            input: 'radio',
            info: 'Please specify the condition of the mammal.',
            inputProps: { options: typeValues },
          },
        },
        remote: { id: 800, values: typeValues },
      },

      gender: {
        menuProps: { icon: genderIcon },
        pageProps: {
          attrProps: {
            input: 'radio',
            info: 'Please specify the gender of the mammal.',
            inputProps: { options: genderValues },
          },
        },
        remote: { id: 836, values: genderValues },
      },

      age: {
        menuProps: { icon: ageIcon },
        pageProps: {
          attrProps: {
            input: 'radio',
            info: 'Please specify the age of the mammal.',
            inputProps: { options: ageValues },
          },
        },
        remote: { id: 824, values: ageValues },
      },

      decomposition: {
        menuProps: { icon: skullIcon },
        pageProps: {
          attrProps: {
            input: 'radio',
            info: 'Please specify the state of decomposition of the mammal.',
            inputProps: { options: decompositionValues },
          },
          remote: { id: 825, values: decompositionValues },
        },
      },

      number: {
        pageProps: {
          attrProps: {
            input: 'slider',
            inputProps: {
              max: 499,
              min: 0,
              step: 1,
            },
          },
        },
        remote: {
          id: 16,
        },
      },

      'number-ranges': {
        pageProps: {
          attrProps: {
            input: 'radio',
            inputProps: { options: numberRangesValues },
          },
        },
        remote: { id: 320, values: numberRangesValues },
      },

      comment: {
        menuProps: { icon: chatboxOutline, skipValueTranslation: true },
        pageProps: {
          attrProps: {
            input: 'textarea',
            info: 'Please add any extra info about this record.',
          },
        },
      },
    },

    verify(attrs: any) {
      try {
        const occurrenceScheme = Yup.object().shape({
          taxon: Yup.object().nullable().required('Please select a species.'),
        });

        occurrenceScheme.validateSync(attrs, { abortEarly: false });
      } catch (attrError) {
        return attrError;
      }

      return null;
    },

    create(Occurrence: typeof AppOccurrence) {
      return new Occurrence({
        metadata: {},
        attrs: {
          comment: null,
          taxon: null,
          number: null,
        },
      });
    },
  },

  verify(_: any, sample: any) {
    try {
      Yup.object()
        .shape({
          attrs: Yup.object().shape({
            location: verifyLocationSchema,
          }),
        })
        .validateSync(sample, { abortEarly: false });
    } catch (attrError) {
      return attrError;
    }
    return null;
  },

  create(AppSample: any, training?: string) {
    const sample = new AppSample({
      metadata: {
        survey: record.name,
        survey_id: record.id,
        training,
      },

      attrs: {
        location: null,
        device: isPlatform('android') ? 'android' : 'ios',
        appVersion: config.version,
      },
    });

    const occurrence = record.occ?.create(AppOccurrence);

    sample?.occurrences.push(occurrence);

    sample.startGPS();

    return sample;
  },
};

export default record;
