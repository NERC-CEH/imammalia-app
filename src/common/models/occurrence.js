import Indicia from 'indicia';
import * as Yup from 'yup';
import { observable, toJS } from 'mobx';
import CONFIG from 'config';
import ImageModel from './image';

const schema = Yup.object().shape({
  taxon: Yup.mixed().test('species', 'Please select a species.', val => {
    try {
      Yup.object()
        .shape({
          english: Yup.string().required(),
          id: Yup.number().required(),
          taxon: Yup.string().required(),
          warehouse_id: Yup.number().required(),
        })
        .validateSync(val);
    } catch (e) {
      return false;
    }
    return true;
  }),
});

export default Indicia.Occurrence.extend({
  Media: ImageModel,

  initialize() {
    this.attributes = observable(this.attributes);
    this.metadata = observable(this.metadata);
    this.media.models = observable(this.media.models);
  },

  defaults() {
    return {
      comment: null,
      method: null,
      type: null,
      number: null,
      age: null,
      decomposition: null,
      gender: null,
      'number-ranges': null,
      taxon: {
        scientific_name: null,
        warehouse_id: null,
      },
    };
  },

  keys: CONFIG.indicia.attrs.occ, // warehouse attribute keys

  /**
   * Disable sort for mobx to keep the same refs.
   * @param mediaObj
   */
  addMedia(mediaObj) {
    if (!mediaObj) return;
    mediaObj.setParent(this);
    this.media.add(mediaObj, { sort: false });
  },

  validateRemote() {
    try {
      schema.validateSync(this.attributes);
    } catch (e) {
      return e;
    }
    return null;
  },

  toJSON() {
    const json = Indicia.Occurrence.prototype.toJSON.apply(this);
    json.attributes = toJS(json.attributes);
    json.metadata = toJS(json.metadata);
    return json;
  },
});
