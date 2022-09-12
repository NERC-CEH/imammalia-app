import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  'draftId:main'?: string | null;
};

export type Attrs = ModelAttrs & {
  appSession: any;
  showedWelcome: any;
  language: any;
  country: any;
  useTraining: any;
  feedbackGiven: any;
  recordDraftId: any;
  speciesFilter: any;
  useExperiments: any;
  sendAnalytics: any;
  training: string | null;
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
  training: null,

  useExperiments: false,
  sendAnalytics: true,
};

export class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);
}

const appModel = new AppModel({ cid: 'app', store: genericStore });
export default appModel;
