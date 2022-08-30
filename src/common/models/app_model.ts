import { Model, ModelAttrs } from '@flumens';
import { genericStore } from './store';

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
};

export class AppModel extends Model {
  attrs: Attrs = Model.extendAttrs(this.attrs, defaults);

  // toggleTaxonFilter(filter) {
  //   const taxonGroupFilters = this.get('taxonGroupFilters');
  //   const index = taxonGroupFilters.indexOf(filter);
  //   if (index >= 0) {
  //     taxonGroupFilters.splice(index, 1);
  //   } else {
  //     taxonGroupFilters.push(filter);
  //   }

  //   this.save();
  // }
}

const appModel = new AppModel({ cid: 'app', store: genericStore });
export default appModel;
