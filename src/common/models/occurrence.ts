import { Occurrence, OccurrenceAttrs, validateRemoteModel } from '@flumens';
import Media from './media';

type Data = OccurrenceAttrs & {
  taxon: any;
  number?: number;
  'number-ranges'?: string;
};

export default class AppOccurrence extends Occurrence<Data> {
  validateRemote = validateRemoteModel;

  constructor(options: any) {
    super({ ...options, Media });
  }
}
