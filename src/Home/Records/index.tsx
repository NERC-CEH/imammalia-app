import { useState } from 'react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { Page, Main, device, useToast } from '@flumens';
import {
  IonList,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonBadge,
  IonSegmentButton,
  IonSegment,
  IonButton,
} from '@ionic/react';
import InfoBackgroundMessage from 'common/Components/InfoBackgroundMessage';
import samples, { uploadAllSamples } from 'models/collections/samples';
import Sample from 'models/sample';
import Record from './components';
import './styles.scss';

function byCreateTime(smp1: Sample, smp2: Sample) {
  const date1 = new Date(smp1.createdAt);
  const date2 = new Date(smp2.createdAt);
  return date2.getTime() - date1.getTime();
}

function hasManyPending(pendingSurveys: Sample[]) {
  return pendingSurveys.length > 2;
}

function getPendingSurveys(surveys: any[], uploadIsPrimary: boolean) {
  const byFinishedSurvey = (sample: Sample) => sample.metadata.saved;
  const finishedSurvey = surveys.find(byFinishedSurvey);

  if (!surveys.length) {
    return (
      <IonList lines="full">
        <InfoBackgroundMessage>
          No finished pending records
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  const getSurveyEntry = (sample: Sample) => (
    <Record
      key={sample.cid}
      sample={sample}
      uploadIsPrimary={uploadIsPrimary}
    />
  );
  const surveysList = surveys.map(getSurveyEntry);

  if (finishedSurvey) {
    return (
      <IonList lines="full">
        {surveysList}

        <InfoBackgroundMessage name="showSurveyUploadTip">
          Please do not forget to upload any pending records!
        </InfoBackgroundMessage>
      </IonList>
    );
  }

  return (
    <IonList lines="full">
      {surveysList}

      <InfoBackgroundMessage name="showSurveysDeleteTip">
        To delete any records swipe it to the left.
      </InfoBackgroundMessage>
    </IonList>
  );
}

function getUploadedSurveys(surveys: any[]) {
  if (!surveys.length) {
    return (
      <IonList lines="full">
        <InfoBackgroundMessage>No uploaded records</InfoBackgroundMessage>
      </IonList>
    );
  }

  const getUploadedSurveyEntry = (sample: Sample) => (
    <Record key={sample.cid} sample={sample} />
  );
  const surveysList = surveys.map(getUploadedSurveyEntry);

  return <IonList lines="full">{surveysList}</IonList>;
}

const UserSurveys = () => {
  const [segment, setSegment] = useState('pending');
  const toast = useToast();

  const onSegmentClick = (e: any) => setSegment(e.detail.value);

  const getSamplesList = (uploaded?: boolean) => {
    const uploadedSamples = (sample: Sample) =>
      uploaded ? sample.syncedAt : !sample.syncedAt;
    return samples.filter(uploadedSamples).sort(byCreateTime);
  };

  const onUploadAll = () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    uploadAllSamples(toast);
  };

  const showingPending = segment === 'pending';
  const showingUploaded = segment === 'uploaded';

  const pendingSurveys = getSamplesList();
  const uploadedSurveys = getSamplesList(true);

  const getPendingSurveysCount = () => {
    if (!pendingSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="secondary" slot="end">
        {pendingSurveys.length}
      </IonBadge>
    );
  };

  const getUploadedSurveysCount = () => {
    if (!uploadedSurveys.length) {
      return null;
    }

    return (
      <IonBadge color="light" slot="end">
        {uploadedSurveys.length}
      </IonBadge>
    );
  };

  const showUploadAll = hasManyPending(pendingSurveys);

  return (
    <Page id="surveys-list">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonSegment onIonChange={onSegmentClick} value={segment}>
            <IonSegmentButton value="pending">
              <IonLabel className="ion-text-wrap">
                <T>Pending</T>
                {getPendingSurveysCount()}
              </IonLabel>
            </IonSegmentButton>

            <IonSegmentButton value="uploaded">
              <IonLabel className="ion-text-wrap">
                <T>Uploaded</T>
                {getUploadedSurveysCount()}
              </IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <Main>
        {showingPending && showUploadAll && (
          <IonButton
            expand="block"
            size="small"
            className="upload-all-button"
            color="secondary"
            onClick={onUploadAll}
          >
            <T>Upload All</T>
          </IonButton>
        )}

        {showingPending && getPendingSurveys(pendingSurveys, !showUploadAll)}
        {showingUploaded && getUploadedSurveys(uploadedSurveys)}
      </Main>
    </Page>
  );
};

export default observer(UserSurveys);
