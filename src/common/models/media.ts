import { Capacitor } from '@capacitor/core';
import {
  Filesystem,
  Directory as FilesystemDirectory,
} from '@capacitor/filesystem';
import { Media as MediaOriginal, MediaData } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import Occurrence from 'models/occurrence';
import Sample from 'models/sample';

type Attrs = MediaData;

export default class Media extends MediaOriginal<Attrs> {
  declare parent?: Sample | Occurrence;

  async destroy(silent?: boolean) {
    // remove from internal storage
    if (!isPlatform('hybrid')) {
      if (!this.parent) return;

      this.parent.media.remove(this);

      if (silent) return;

      this.parent.save();
      return;
    }

    const URL = this.data.data;

    try {
      await Filesystem.deleteFile({
        path: URL,
        directory: FilesystemDirectory.Data,
      });

      if (!this.parent) return;

      this.parent.media.remove(this);

      if (silent) return;

      this.parent.save();
    } catch (err) {
      console.error(err);
    }
  }

  getURL() {
    const { data: name } = this.data;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }
}
