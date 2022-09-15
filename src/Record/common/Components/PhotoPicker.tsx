import { FC } from 'react';
import { PhotoPicker, captureImage, useToast } from '@flumens';
import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import Media from 'models/media';
import Sample from 'models/sample';
import Occurrence from 'models/occurrence';
import config from 'common/config';

type URL = string;

type Props = {
  model: Sample | Occurrence;
};

const AppPhotoPicker: FC<Props> = ({ model }) => {
  const toast = useToast();

  async function onAddNew(shouldUseCamera: boolean) {
    try {
      const photoURLs = await captureImage({ camera: shouldUseCamera });

      if (!photoURLs.length) return;

      const getImageModel = async (imageURL: URL) =>
        Media.getImageModel(
          isPlatform('hybrid') ? Capacitor.convertFileSrc(imageURL) : imageURL,
          config.dataPath
        );
      const imageModels: Media[] = await Promise.all<any>(
        photoURLs.map(getImageModel)
      );

      model.media.push(...imageModels);
      model.save();
    } catch (e: any) {
      toast.error(e);
    }
  }

  return (
    <PhotoPicker
      onAddNew={onAddNew}
      model={model}
      isDisabled={model.isDisabled()}
    />
  );
};

export default AppPhotoPicker;
