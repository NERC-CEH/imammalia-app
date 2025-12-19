import { IObservableArray } from 'mobx';
import { useTranslation } from 'react-i18next';
import {
  Sample as SampleOriginal,
  SampleData,
  SampleOptions,
  ModelValidationMessage,
  useAlert,
  device,
  SampleMetadata,
} from '@flumens';
import config from 'common/config';
import survey, { Survey } from '../../../Survey/config';
import Media from '../media';
import Occurrence from '../occurrence';
import { samplesStore } from '../store';
import userModel from '../user';
import GPSExtension from './GPSExt';

type Data = SampleData & {
  location?: any;
  device?: string;
  app_version?: string;
  device_version?: string;
  manual_location_accuracy?: any;
};

type Metadata = SampleMetadata & {
  saved?: boolean;
  training?: boolean;
};

class Sample extends SampleOriginal<Data, Metadata> {
  declare occurrences: IObservableArray<Occurrence>;

  declare samples: IObservableArray<Sample>;

  declare media: IObservableArray<Media>;

  declare parent?: Sample;

  isGPSRunning: any;

  stopGPS: any; // from extension

  startGPS: any; // from extension

  gpsExtensionInit: any;

  constructor(options: SampleOptions<Data>) {
    super({
      ...options,
      Occurrence,
      Media,
      store: samplesStore,
      url: config.backend.indicia.url,
      getAccessToken: () => userModel.getAccessToken(),
    });

    this.survey = survey as Survey;

    if (!this.data.surveyId) {
      this.data.surveyId = survey.id; // backward compatibility, remove later once uploads are fixed
    }

    Object.assign(this, GPSExtension());
  }

  cleanUp() {
    this.stopGPS();

    const stopGPS = (smp: Sample) => {
      smp.stopGPS();
    };
    this.samples.forEach(stopGPS);
  }

  async upload() {
    if (this.isSynchronising || this.isUploaded) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    const isActivated = await userModel.checkActivation();
    if (!isActivated) return false;

    this.cleanUp();

    return this.saveRemote();
  }
}

export const useValidateCheck = (sample?: Sample) => {
  const alert = useAlert();
  const { t } = useTranslation();

  const showValidateCheck = () => {
    const invalids = sample?.validateRemote();
    if (invalids) {
      alert({
        header: t('Survey incomplete'),
        skipTranslation: true,
        message: <ModelValidationMessage {...invalids} />,
        buttons: [
          {
            text: t('Got it'),
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };

  return showValidateCheck;
};

export default Sample;
