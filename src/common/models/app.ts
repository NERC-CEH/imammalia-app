import { Model, ModelData } from '@flumens';
import { mainStore } from './store';

export type SurveyDraftKeys = {
  recordDraftId: string | null;
};

export type Data = ModelData &
  SurveyDraftKeys & {
    appSession: any;
    showedWelcome: any;
    language: any;
    country: any;
    useTraining: boolean;
    feedbackGiven: any;
    speciesFilter: string[];
    useExperiments: any;
    sendAnalytics: any;

    showSurveysDeleteTip: boolean;
    showSurveyUploadTip: boolean;
  };

const defaults: Data = {
  appSession: 0,
  showedWelcome: false,
  language: null,
  country: null,
  useTraining: false,
  feedbackGiven: false,
  speciesFilter: [],

  useExperiments: false,
  sendAnalytics: true,

  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,
  recordDraftId: null,
};

export class AppModel extends Model<Data> {
  constructor(options: any) {
    super({ ...options, data: { ...defaults, ...options.data } });
  }

  reset() {
    return super.reset(defaults);
  }
}

const appModel = new AppModel({ id: 'app', cid: 'app', store: mainStore });

export default appModel;
