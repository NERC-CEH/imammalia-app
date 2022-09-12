import { useState, FC } from 'react';
import { observer } from 'mobx-react';
import {
  Page,
  Header,
  ModelLocationMap,
  Main,
  InfoButton,
  InfoMessage,
  useToast,
  device,
  prettyPrintLocation,
} from '@flumens';
import Sample from 'models/sample';
import { IonHeader, IonTitle, IonButtons, IonBackButton } from '@ionic/react';
import appModel from 'models/app';
import config from 'common/config';
import Leaflet, { Map } from 'leaflet';
import { Trans as T, useTranslation } from 'react-i18next';
import {
  IonToolbar,
  IonItem,
  IonLabel,
  IonSelectOption,
  IonSelect,
} from '@ionic/react';
import './styles.scss';

// const PAGE_INDEX = 1;

type Props = {
  sample: Sample;
};

const Location: FC<Props> = ({ sample: model }) => {
  const { t } = useTranslation();

  const [map, setMap] = useState<Map | null>();

  const assignRef = (mapRef: Leaflet.Map) => setMap(mapRef);

  // const isValueValid = () => model.attrs.location;

  const location = model.attrs.location || {};

  const getToolbar = () => {
    if (!location || !location.latitude) {
      return (
        <IonItem>
          <IonLabel color="light" className="ion-text-center ion-text-wrap">
            <T>Please use the GPS or tap on the map to select your location</T>
          </IonLabel>
        </IonItem>
      );
    }

    if (location.source !== 'map' && location.accuracy) {
      return (
        <IonItem>
          <IonLabel color="light" className="ion-text-center ion-text-wrap">
            <T>Location Accuracy</T> {`${location.accuracy}m`}
          </IonLabel>
        </IonItem>
      );
    }

    return (
      <IonItem>
        <IonLabel>
          <T>Location Accuracy</T>
        </IonLabel>
        <IonSelect
          value={10}
          okText={t('OK')}
          cancelText={t('Close')}
          // onIonChange={setLocationAccuracy}
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

  const setLocation = (location: any) => {
    // if (location && location.source === 'map' && location.accuracy >= 500) {
    //   toast.warn('Please select a more accurate location');
    //   return;
    // }

    // const setLocationAccuracy();

    // eslint-disable-next-line no-param-reassign
    model.attrs.location = { ...model.attrs.location, ...location };

    model.save();
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
          model={model}
          location={location}
          setLocation={setLocation}
          mapProviderOptions={config.map}
          onGPSClick={ModelLocationMap.utils.onGPSClick}
          whenCreated={assignRef}
        />
      </Main>
    </Page>
  );
};

export default observer(Location);
