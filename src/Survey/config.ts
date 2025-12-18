import { chatboxOutline, calendarOutline } from 'ionicons/icons';
import z, { object } from 'zod';
import {
  dateFormat,
  device,
  MenuAttrItemFromModelMenuProps,
  PageProps,
  RemoteConfig,
} from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import appModel from 'common/models/app';
import Sample from 'common/models/sample';
import Occurrence from 'models/occurrence';
import ageIcon from './common/images/age.svg';
import binocularsIcon from './common/images/binoculars.svg';
import footprintIcon from './common/images/footprint.svg';
import genderIcon from './common/images/gender.svg';
import skullIcon from './common/images/skull.svg';

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
  { value: '1', id: 3808 },
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

type MenuProps = MenuAttrItemFromModelMenuProps;

export type AttrConfig = {
  menuProps?: MenuProps;
  pageProps?: Omit<PageProps, 'attr' | 'model'>;
  remote?: RemoteConfig;
};

interface Attrs {
  [key: string]: AttrConfig;
}

type OccurrenceConfig = {
  render?: any[] | ((model: Occurrence) => any[]);
  attrs: Attrs;
  create?: () => Occurrence;
  verify?: (attrs: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  /**
   * Set to true if multi-species surveys shouldn't auto-increment it to 1 when adding to lists.
   */
  skipAutoIncrement?: boolean;
};

export type SampleConfig = {
  render?: any[] | ((model: Sample) => any[]);
  attrs?: Attrs;
  create?: () => Sample;
  verify?: (attrs: any, model: any) => any;
  modifySubmission?: (submission: any, model: any) => any;
  smp?: SampleConfig;
  occ?: OccurrenceConfig;
};

export interface Survey extends SampleConfig {
  /**
   * Remote warehouse survey ID.
   */
  id: number;
  /**
   * In-App survey code name.
   */
  name: string;
  /**
   * Pretty survey name to show in the UI.
   */
  label?: string;
  deprecated?: boolean;
  /**
   * Remote website survey edit page path.
   */
  webForm?: string;
}

const survey: Survey = {
  id: 571,
  name: 'main',
  webForm: 'enter-app-record',

  attrs: {
    location: {
      remote: {
        id: 'entered_sref',
        values(location: any, submission: any) {
          // convert accuracy for map and gridref sources
          const { accuracy, source, altitude, altitudeAccuracy } = location;

          // add other location related attributes
          // eslint-disable-next-line
          submission.values = { ...submission.values };

          submission.values['smpAttr:760'] = source; // eslint-disable-line
          submission.values['smpAttr:282'] = accuracy; // eslint-disable-line
          submission.values['smpAttr:283'] = altitude; // eslint-disable-line
          submission.values['smpAttr:284'] = altitudeAccuracy; // eslint-disable-line

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
      remote: {
        values: (date: any) => dateFormat.format(new Date(date)),
      },
    },

    manual_location_accuracy: {
      remote: { id: 1446, values: manualLocationAccuracy },
    },

    device: {
      remote: {
        id: 922,
        values: {
          ios: 2398,
          android: 2399,
        },
      },
    },

    device_version: { remote: { id: 759 } },
    app_version: { remote: { id: 1139 } },
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
        },
        remote: { id: 825, values: decompositionValues },
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

    verify: (attrs: any) =>
      object({
        taxon: object(
          {},
          {
            required_error: 'Please select a species.',
            invalid_type_error: 'Please select a species.',
          }
        ),
      }).safeParse(attrs).error,

    create() {
      return new Occurrence({
        metadata: {},
        data: {
          comment: null,
          taxon: null,
          number: null,
        },
      });
    },
  },

  verify: (data: any) =>
    object({
      location: z
        .object(
          {
            latitude: z.number().nullable().optional(),
            longitude: z.number().nullable().optional(),
          },
          {
            required_error: 'Please add record location.',
            invalid_type_error: 'Please add record location.',
          }
        )
        .refine(
          (val: any) =>
            Number.isFinite(val.latitude) && Number.isFinite(val.longitude),
          'Please add record location.'
        ),
    }).safeParse(data).error,

  create() {
    const sample = new Sample({
      metadata: {
        survey: survey.name,
      },

      data: {
        surveyId: survey.id,
        date: new Date().toISOString(),
        enteredSrefSystem: 4326,
        training: appModel.data.useTraining,
        inputForm: survey.webForm,

        location: null,

        device_version: device.info?.osVersion,
        device: isPlatform('android') ? 'android' : 'ios',
        app_version: config.version,
      },
    });

    const occurrence = survey.occ!.create!();

    sample?.occurrences.push(occurrence);

    sample.startGPS();

    return sample;
  },
};

export default survey;
