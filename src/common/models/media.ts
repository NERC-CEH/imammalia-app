import { Media, MediaAttrs } from '@flumens';
import { isPlatform } from '@ionic/react';
import config from 'common/config';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

type Attrs = MediaAttrs;

export default class AppMedia extends Media {
  attrs: Attrs = this.attrs;

  // eslint-disable-next-line class-methods-use-this
  validateRemote() {
    return null;
  }

  async destroy(silent?: boolean) {
    // remove from internal storage
    if (!isPlatform('hybrid')) {
      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      if (silent) {
        return null;
      }

      return this.parent.save();
    }

    const URL = this.attrs.data;

    try {
      await Filesystem.deleteFile({
        path: URL,
        directory: Directory.Data,
      });

      if (!this.parent) {
        return null;
      }

      this.parent.media.remove(this);

      if (silent) {
        return null;
      }

      return this.parent.save();
    } catch (err) {
      console.error(err);
    }

    return null;
  }

  getURL() {
    const { data: name } = this.attrs;

    if (!isPlatform('hybrid') || process.env.NODE_ENV === 'test') {
      return name;
    }

    return Capacitor.convertFileSrc(`${config.dataPath}/${name}`);
  }
}
