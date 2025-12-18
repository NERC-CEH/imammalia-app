import { useRef } from 'react';
import { observer } from 'mobx-react';
import { Trans as T, useTranslation } from 'react-i18next';
import { MapContainer, Page, Main, mapEventToLocation } from '@flumens';
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
import config from 'common/config';
import Sample from 'models/sample';
import './styles.scss';

type Props = {
  sample: Sample;
};

const Location = ({ sample }: Props) => {
  const { t } = useTranslation();

  const selectRef = useRef<any>(undefined);

  const accuracy = sample.data.manual_location_accuracy;

  const location = sample.data.location || {};

  const setLocationAccuracy = (acc: any) => {
    // eslint-disable-next-line no-param-reassign
    sample.data.manual_location_accuracy = acc.detail.value;
    // eslint-disable-next-line no-param-reassign
    sample.data.location.accuracy = null;
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
    sample.data.location = { ...sample.data.location, ...loc };
    sample.save();

    setTimeout(() => {
      selectRef.current?.open();
    }, 500); // give some time for the location accuracy field to appear after first click
  };

  function onGPSClick() {
    // turn off if running
    if (sample.isGPSRunning()) {
      sample.stopGPS();
    } else {
      sample.startGPS();
      // eslint-disable-next-line no-param-reassign
      sample.data.manual_location_accuracy = null;
      sample.save();
    }
  }

  const onMapClick = (e: any) => setLocation(mapEventToLocation(e));

  // eslint-disable-next-line unused-imports/no-unused-vars
  const { gridref, ...locationWithoutGridRef } = location;

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
        <MapContainer
          onClick={onMapClick}
          accessToken={config.map.mapboxApiKey}
          maxPitch={0}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v10"
          initialViewState={location}
        >
          <MapContainer.Control.Geolocate
            isLocating={sample.isGPSRunning}
            onClick={onGPSClick}
          />

          <MapContainer.Marker {...locationWithoutGridRef} />
        </MapContainer>
      </Main>
    </Page>
  );
};

export default observer(Location);
