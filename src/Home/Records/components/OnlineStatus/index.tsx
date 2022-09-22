import { FC } from 'react';
import { IonSpinner, IonLabel, IonChip, IonButton } from '@ionic/react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import { Trans as T } from 'react-i18next';
import './styles.scss';

type Props = {
  sample: Sample;
  onUpload: any;
  uploadIsPrimary: boolean;
};

const OnlineStatus: FC<Props> = ({ sample, onUpload, uploadIsPrimary }) => {
  const { saved } = sample.metadata;

  if (!saved) {
    return (
      <IonChip slot="end" class="survey-status">
        <IonLabel>
          <T>Draft</T>
        </IonLabel>
      </IonChip>
    );
  }

  if (sample.remote.synchronising) {
    return <IonSpinner class="survey-status" />;
  }

  if (sample.isUploaded()) {
    return null;
  }

  const onUploadWrap = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    onUpload();
  };

  return (
    <IonButton
      class="survey-status-upload"
      color="secondary"
      onClick={onUploadWrap}
      fill={uploadIsPrimary ? undefined : 'outline'}
    >
      <T>Upload</T>
    </IonButton>
  );
};

export default observer(OnlineStatus);
