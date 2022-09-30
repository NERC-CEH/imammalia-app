import {
  Sample,
  SampleAttrs,
  SampleOptions,
  useAlert,
  getDeepErrorMessage,
  device,
} from '@flumens';
import config from 'common/config';
import { isPlatform } from '@ionic/react';
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

  cleanUp() {
    this.stopGPS();

    const stopGPS = (smp: AppSample) => {
      smp.stopGPS();
    };
    this.samples.forEach(stopGPS);
  }

  async upload() {
    if (this.remote.synchronising || this.isUploaded()) return true;

    const invalids = this.validateRemote();
    if (invalids) return false;

    if (!device.isOnline) return false;

    const isActivated = await userModel.checkActivation();
    if (!isActivated) return false;

    this.cleanUp();

    return this.saveRemote();
  }

  _attachTopSampleSubmission(updatedSubmission: any) {
    const isTopSample = !this.parent;
    if (!isTopSample) {
      return;
    }

    const keys = this.keys();

    const platform = isPlatform('android') ? 'Android' : 'iOS';

    const byPlatform = (mobileDevice: { value: string; id: number }) =>
      mobileDevice.value === platform ? mobileDevice : undefined;

    const appAndDeviceFields = {
      [`smpAttr:${keys.device.id}`]: keys.device.values.find(byPlatform).id,
      [`smpAttr:${keys.device_version.id}`]: device?.info?.osVersion,
      [`smpAttr:${keys.app_version.id}`]: config.version,
    };

    // eslint-disable-next-line no-param-reassign
    updatedSubmission.values = {
      ...updatedSubmission.values,
      ...appAndDeviceFields,
    };
  }

  getSubmission(...args: any) {
    const submission = super.getSubmission(...args);

    const newAttrs = {
      survey_id: surveyConfig.id,
      input_form: surveyConfig.webForm,
    };
    const updatedSubmission = {
      ...submission,
      values: { ...submission.values, ...newAttrs },
    };

    this._attachTopSampleSubmission(updatedSubmission);

    return updatedSubmission;
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
