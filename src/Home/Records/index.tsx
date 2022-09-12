import { FC, useState } from 'react';
import { Page, Main, InfoBackgroundMessage } from '@flumens';
import savedSamples from 'models/savedSamples';
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
import { Trans as T } from 'react-i18next';
import { observer } from 'mobx-react';
import Record from './components/Record';
import './styles.scss';

function byCreateTime(occ1: any, occ2: any) {
  const date1 = new Date(occ1.metadata.created_on);
  const date2 = new Date(occ2.metadata.created_on);
  return date2.getTime() - date1.getTime();
}

function getPendingRecords(records: any) {
  if (!records.length) {
    return (
      <InfoBackgroundMessage>No finished pending records</InfoBackgroundMessage>
    );
  }

  const getRecord: any = (sample: any) => (
    <Record key={sample.cid} sample={sample} />
  );
  return <IonList>{records.map(getRecord)}</IonList>;
}

function getUploadedRecords(records: any) {
  if (!records.length) {
    return <InfoBackgroundMessage>No uploaded records</InfoBackgroundMessage>;
  }

  return (
    <IonList>
      {records.map((sample: any) => (
        <Record key={sample.cid} sample={sample} />
      ))}
    </IonList>
  );
}

type Props = {
  savedSamples: typeof savedSamples;
};

const UserRecordsComponent: FC<Props> = ({ savedSamples }) => {
  const [segment, setSegment] = useState('pending');

  const onSegmentClick = (e: any) => setSegment(e.detail.value);

  // const getSamplesList = (uploaded?: any) => {
  //   return savedSamples.models
  //     .filter((sample: any) =>
  //       uploaded ? sample.metadata.synced_on : !sample.metadata.synced_on
  //     )
  //     .sort(byCreateTime);
  // };

  const showingPending = segment === 'pending';
  const showingUploaded = segment === 'uploaded';

  // const pendingRecords = getSamplesList();
  // const uploadedRecords = getSamplesList(true);

  return (
    <Page id="user-report">
      <Main className="ion-padding">
        <IonSegment onIonChange={onSegmentClick} value={segment}>
          {/* <IonSegmentButton value="pending">
            <IonLabel>
              <T>Pending</T>
              {pendingRecords.length ? (
                <IonBadge color="danger" slot="end">
                  {pendingRecords.length}
                </IonBadge>
              ) : null}
            </IonLabel>
          </IonSegmentButton> */}
          {/* <IonSegmentButton value="uploaded">
            <IonLabel>
              <T>Uploaded</T>
              {uploadedRecords.length ? (
                <IonBadge color="light" slot="end">
                  {uploadedRecords.length}
                </IonBadge>
              ) : null}
            </IonLabel>
          </IonSegmentButton> */}
        </IonSegment>

        {/* {showingPending && getPendingRecords(pendingRecords)} */}
        {/* {showingUploaded && getUploadedRecords(uploadedRecords)} */}
      </Main>
    </Page>
  );
};

export default observer(UserRecordsComponent);
