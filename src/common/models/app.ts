import { set as setMobXAttrs } from 'mobx';
import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

export type SurveyDraftKeys = {
  recordDraftId: string | null;
};

export type Attrs = ModelAttrs &
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

const defaults: Attrs = {
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

export class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  constructor({ store, ...options }: any) {
    super(options);

    this._store = store;
    this.ready = this._fromOldStore();
  }

  // backwards compatible convert old store document
  private async _fromOldStore(): Promise<boolean> {
    if (!this._store) return false;

    let document = await this._store.find(this.cid);

    if (!document) {
      await this.save(); // persisting for the first time
      return true;
    }

    const isOldTypeDocument = typeof document === 'string';
    if (isOldTypeDocument) {
      console.log('Converting old type document');
      document = JSON.parse(document);
    }

    if (document.id) this.id = document.id; // checking presence for backwards compatibility
    if (document.cid) this.cid = document.cid; // checking presence for backwards compatibility
    setMobXAttrs(this.attrs, document.attrs);
    setMobXAttrs(this.metadata, document.metadata);

    if (isOldTypeDocument) this.save();
    return true;
  }

  resetDefaults() {
    return super.resetDefaults(defaults);
  }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });
export default appModel;
