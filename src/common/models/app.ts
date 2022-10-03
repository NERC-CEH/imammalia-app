import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  'draftId:main': string | null;
};

export type Attrs = ModelAttrs &
  SurveyDraftKeys & {
    appSession: any;
    showedWelcome: any;
    language: any;
    country: any;
    useTraining: boolean;
    feedbackGiven: any;
    recordDraftId: any;
    speciesFilter: string[];
    useExperiments: any;
    sendAnalytics: any;

    showSurveysDeleteTip: boolean;
    showSurveyUploadTip: boolean;
  };

const defaults: Attrs = {
  appSession: 0,
  showedWelcome: false,
  language: null,
  country: null,
  useTraining: false,
  feedbackGiven: false,
  recordDraftId: null,
  speciesFilter: [],

  useExperiments: false,
  sendAnalytics: true,

  showSurveysDeleteTip: true,
  showSurveyUploadTip: true,

  'draftId:main': null,
};

export class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  resetDefaults() {
    return super.resetDefaults(defaults);
  }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });
export default appModel;
