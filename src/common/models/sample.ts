import { Sample, SampleAttrs, SampleOptions } from '@flumens';
import config from 'common/config';
import surveyConfig from '../../Record/config';
import Occurrence from './occurrence';
import Media from './media';
import userModel from './user';
import { modelStore } from './store';
import GPSExtension from './GPSExt';

// import GPSExtension from './sampleGPSExt';
// import Occurrence from './occurrence';
// import Media from './image';

type Attrs = SampleAttrs & {
  date: any;
  location?: any;
};

class AppSample extends Sample {
  static fromJSON(json: any) {
    return super.fromJSON(json, Occurrence, AppSample, Media);
  }

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

    // Object.assign(this, GPSExtension);
    // this.gpsExtensionInit();
  }
}

export default AppSample;
