import { Occurrence, OccurrenceAttrs, validateRemoteModel } from '@flumens';
import Media from './media';

type Attrs = OccurrenceAttrs & {
  taxon: any;
  number?: number;
  'number-ranges'?: string;
};

export default class AppOccurrence extends Occurrence {
  static fromJSON(json: any) {
    return super.fromJSON(json, Media);
  }

  attrs: Attrs = this.attrs;

  media: Media[] = this.media;

  validateRemote = validateRemoteModel;

  // eslint-disable-next-line
  isDisabled = () => this.isUploaded();
}
