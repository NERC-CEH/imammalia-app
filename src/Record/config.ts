import { date as dateHelp } from '@flumens';
import AppOccurrence from 'models/occurrence';
import { isPlatform } from '@ionic/react';
import { chatboxOutline, calendarOutline } from 'ionicons/icons';
import config from 'common/config';
import binocularsIcon from './common/images/binoculars.svg';
import footprintIcon from './common/images/footprint.svg';

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

// number: {
//   label: 'Number',
//   id: 16,
// },

const record: any = {
  id: -1,
  name: 'main',

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
    // ...locationAttrs,
    // device: deviceAttr,
    // appVersion: appVersionAttr,
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
            info: 'How many individuals of this type',
            inputProps: { options: typeValues },
          },
        },
        remote: { id: 523, values: typeValues },
      },

      number: {
        pageProps: {
          attrProps: {
            input: 'slider',
            inputProps: {
              max: 3000,
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

  create(AppSample: any) {
    const sample = new AppSample({
      metadata: {
        survey: record.name,
        survey_id: record.id,
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

  // verify(attrs) {
  //   try {
  //     const sampleSchema = Yup.object().shape({
  //       location: verifyLocationSchema,
  //     });

  //     sampleSchema.validateSync(attrs, { abortEarly: false });
  //   } catch (attrError) {
  //     return attrError;
  //   }

  //   return null;
  // },
};

export default record;
