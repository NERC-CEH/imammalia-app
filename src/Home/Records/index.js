import React from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonSegment,
  IonLabel,
  IonSegmentButton,
  IonBadge,
  IonPage,
} from '@ionic/react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Record from './components/Record';
import './styles.scss';

function byCreateTime(occ1, occ2) {
  const date1 = new Date(occ1.metadata.created_on);
  const date2 = new Date(occ2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

function getPendingRecords(records) {
  if (!records.length) {
    return (
      <IonList lines="full">
        <IonItem className="empty">
          <span>{t('No finished pending records')}</span>
        </IonItem>
      </IonList>
    );
  }

  return (
    <IonList>
      {records.map(sample => (
        <Record key={sample.cid} sample={sample} />
      ))}
    </IonList>
  );
}

function getUploadedRecords(records) {
  if (!records.length) {
    return (
      <IonList lines="full">
        <IonItem className="empty">
          <span>{t('No uploaded records')}</span>
        </IonItem>
      </IonList>
    );
  }

  return (
    <IonList>
      {records.map(sample => (
        <Record key={sample.cid} sample={sample} />
      ))}
    </IonList>
  );
}

@observer
class Component extends React.Component {
  static propTypes = {
    savedSamples: PropTypes.object.isRequired,
  };

  state = {
    segment: 'pending',
  };

  onSegmentClick = e => {
    this.setState({ segment: e.detail.value });
  };

  getSamplesList(uploaded) {
    const { savedSamples } = this.props;

    return savedSamples.models
      .filter(sample => (uploaded ? sample.metadata.synced_on : !sample.metadata.synced_on))
      .sort(byCreateTime);
  }

  render() {
    const { segment } = this.state;

    const showingPending = segment === 'pending';
    const showingUploaded = segment === 'uploaded';

    const pendingRecords = this.getSamplesList();
    const uploadedRecords = this.getSamplesList(true);

    return (
      <IonPage>
        <IonContent id="user-report" class="ion-padding">
          <IonSegment onIonChange={this.onSegmentClick} value={segment}>
            <IonSegmentButton value="pending" checked={showingPending}>
              <IonLabel>
                {t('Pending')}
                {pendingRecords.length ? (
                  <IonBadge color="danger" slot="end">
                    {pendingRecords.length}
                  </IonBadge>
                ) : null}
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="uploaded" checked={showingUploaded}>
              <IonLabel>
                {t('Uploaded')}
                {uploadedRecords.length ? (
                  <IonBadge color="light" slot="end">
                    {uploadedRecords.length}
                  </IonBadge>
                ) : null}
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {showingPending && getPendingRecords(pendingRecords)}
          {showingUploaded && getUploadedRecords(uploadedRecords)}
        </IonContent>
      </IonPage>
    );
  }
}

export default Component;
