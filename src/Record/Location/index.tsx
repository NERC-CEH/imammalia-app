import { useState, FC, useRef } from 'react';
import { observer } from 'mobx-react';
import { Page, ModelLocationMap, Main } from '@flumens';
import Sample from 'models/sample';
import config from 'common/config';
import Leaflet, { Map } from 'leaflet';
import { Trans as T, useTranslation } from 'react-i18next';
import {
  IonHeader,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonSelect,
} from '@ionic/react';
import './styles.scss';

type Props = {
  sample: Sample;
};

const Location: FC<Props> = ({ sample }) => {
  const { t } = useTranslation();

  const selectRef = useRef<any>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMap] = useState<Map | null>();

  const accuracy = sample.attrs.manual_location_accuracy;

  const assignRef = (mapRef: Leaflet.Map) => setMap(mapRef);

  const location = sample.attrs.location || {};

  const setLocationAccuracy = (acc: any) => {
    // eslint-disable-next-line no-param-reassign
    sample.attrs.manual_location_accuracy = acc.detail.value;
    sample.save();
  };

  const getToolbar = () => {
    if (!location || !location.latitude) {
      return (
        <IonItem lines="none">
          <IonLabel color="light" className="ion-text-center ion-text-wrap">
            <T>Please use the GPS or tap on the map to select your location</T>
          </IonLabel>
        </IonItem>
      );
    }

    if (location.source !== 'map' && location.accuracy) {
      return (
        <IonItem lines="none">
          <IonLabel color="light" className="ion-text-center ion-text-wrap">
            <T>Location Accuracy</T> {`${location?.accuracy}m`}
          </IonLabel>
        </IonItem>
      );
    }

    return (
      <IonItem className="location-accuracy" lines="none">
        <IonLabel>
          <T>Location Accuracy</T>
        </IonLabel>
        <IonSelect
          ref={selectRef}
          value={accuracy}
          okText={t('OK')}
          cancelText={t('Close')}
          onIonChange={setLocationAccuracy}
        >
          <IonSelectOption value="0-10m">0-10m</IonSelectOption>
          <IonSelectOption value="10-50m">10-50m</IonSelectOption>
          <IonSelectOption value="50-100m">50-100m</IonSelectOption>
          <IonSelectOption value="100m-1km">100m-1km</IonSelectOption>
          <IonSelectOption value=">1km">{'>1km'}</IonSelectOption>
          <IonSelectOption value="NA">NA</IonSelectOption>
        </IonSelect>
      </IonItem>
    );
  };

  const setLocation = (loc: any) => {
    sample.isGPSRunning() && sample.stopGPS();

    // eslint-disable-next-line no-param-reassign
    sample.attrs.location = { ...sample.attrs.location, ...loc };
    sample.save();

    selectRef.current.open();
  };

  return (
    <Page id="survey-location-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t('Back')} defaultHref="/" data-label="back" />
          </IonButtons>
          <IonTitle>
            <T>Location</T>
          </IonTitle>
        </IonToolbar>
        <IonToolbar id="location-toolbar">{getToolbar()}</IonToolbar>
      </IonHeader>

      <Main>
        <ModelLocationMap.Map
          model={sample}
          location={location}
          setLocation={setLocation}
          mapProviderOptions={config.map}
          onGPSClick={() => ModelLocationMap.utils.onGPSClick(sample)}
          whenCreated={assignRef}
        />
      </Main>
    </Page>
  );
};

export default observer(Location);
