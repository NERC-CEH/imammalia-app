import {
  Sample,
  SampleAttrs,
  SampleOptions,
  useAlert,
  getDeepErrorMessage,
} from '@flumens';
import config from 'common/config';
import surveyConfig from '../../Record/config';
import Occurrence from './occurrence';
import Media from './media';
import userModel from './user';
import { modelStore } from './store';
import GPSExtension from './GPSExt';

type Attrs = SampleAttrs & {
  date: any;
  location?: any;
  manual_location_accuracy?: any;
};

class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

  isGPSRunning: any;

  stopGPS: any; // from extension

  startGPS: any; // from extension

  gpsExtensionInit: any;

  attrs: Attrs = this.attrs;

  store = modelStore;

  constructor(props: SampleOptions) {
    super(props);
    this.remote.url = `${config.backend.indicia.url}/index.php/services/rest`;
    // eslint-disable-next-line
    this.remote.headers = async () => ({
      Authorization: `Bearer ${await userModel.getAccessToken()}`,
    });

    this.survey = surveyConfig;
    Object.assign(this, GPSExtension());
  }

  async upload() {
    if (this.remote.synchronising || this.isUploaded()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    // if (!device.isOnline) return false;

    // this.saveRemote();

    return true;
  }
}

export const useValidateCheck = (sample: AppSample) => {
  const alert = useAlert();

  const validateAlert = () => {
    const invalids = sample.validateRemote();
    if (invalids) {
      alert({
        header: 'Record incomplete',
        message: getDeepErrorMessage(invalids),
        buttons: [
          {
            text: 'OK, got it',
            role: 'cancel',
          },
        ],
      });
      return false;
    }
    return true;
  };

  return validateAlert;
};

export default AppSample;
