import { FC } from 'react';
import { IonBadge } from '@ionic/react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import SavedSamples from 'models/savedSamples';
import './styles.scss';

function getPendingCount(savedSamples: typeof SavedSamples) {
  const byUploadStatus = (sample: Sample) => !sample.metadata.synced_on;

  return savedSamples.filter(byUploadStatus).length;
}

type Props = {
  savedSamples: typeof SavedSamples;
};

const PendingSurveysBadge: FC<Props> = ({ savedSamples }) => {
  const count = getPendingCount(savedSamples);

  if (count <= 0) {
    return null;
  }

  return (
    <IonBadge color="warning" className="pending-surveys-badge">
      {count}
    </IonBadge>
  );
};

export default observer(PendingSurveysBadge);
