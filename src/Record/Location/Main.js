import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IonIcon,
  IonContent,
  IonLifeCycleContext,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItem,
} from '@ionic/react';
import { locate } from 'ionicons/icons';
import CONFIG from 'config';
import L from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';
import LeafletControl from 'react-leaflet-control';
import { observer } from 'mobx-react';
import 'leaflet/dist/images/marker-icon-2x.png?originalName'; // eslint-disable-line
import 'leaflet/dist/images/marker-shadow.png?originalName'; // eslint-disable-line

L.Icon.Default.imagePath = '/images/';

const DEFAULT_POSITION = [47.946, 8.536];
const DEFAULT_ZOOM = 5;
const DEFAULT_LOCATED_ZOOM = 18;

@observer
class LocationAttr extends Component {
  static contextType = IonLifeCycleContext;

  static propTypes = {
    isGPSTracking: PropTypes.bool.isRequired,
    toggleGPStracking: PropTypes.func.isRequired,
    setLocation: PropTypes.func.isRequired,
    setLocationAccuracy: PropTypes.func.isRequired,
    location: PropTypes.object,
    accuracy: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.map = React.createRef();
    this.selectRef = React.createRef();
  }

  componentDidMount() {
    const { location } = this.props;
    const map = this.map.current.leafletElement;

    if (location && location.latitude) {
      map.setView(
        [location.latitude, location.longitude],
        DEFAULT_LOCATED_ZOOM
      );
    } else {
      map.panTo(new L.LatLng(...DEFAULT_POSITION));
    }

    this.context.onIonViewDidEnter(() => {
      // map.whenReady(() => {
      map.invalidateSize();
      // });
    });
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const prevLocation = prevProps.location || {};

    if (
      location &&
      location.latitude &&
      (location.latitude !== prevLocation.latitude ||
        location.longitude !== prevLocation.longitude)
    ) {
      const map = this.map.current.leafletElement;
      map.setView(
        [location.latitude, location.longitude],
        DEFAULT_LOCATED_ZOOM
      );
    }
  }

  handleClick = ({ latlng }) => {
    const { setLocation } = this.props;
    const { lat, lng } = latlng;
    setLocation([lng, lat]);
    setTimeout(() => this.selectRef.current.open(), 50); // for some reason without a delay the options aren't present the first time
  };

  getToolbar = () => {
    const { location } = this.props;

    if (!location || !location.latitude) {
      return (
        <IonItem>
          <IonLabel color="light" className="ion-text-center ion-text-wrap">
            {t('Please use the GPS or tap on the map to select your location')}
          </IonLabel>
        </IonItem>
      );
    }

    if (location.source !== 'map' && location.accuracy) {
      return (
        <IonItem>
          <IonLabel color="light" className="ion-text-center ion-text-wrap">
            {`${t('Location Accuracy')} ${location.accuracy}m`}
          </IonLabel>
        </IonItem>
      );
    }

    return (
      <IonItem>
        <IonLabel>{t('Location Accuracy')}</IonLabel>
        <IonSelect
          value={this.props.accuracy}
          okText={t('OK')}
          cancelText={t('Close')}
          ref={this.selectRef}
          onIonChange={this.props.setLocationAccuracy}
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

  render() {
    const { isGPSTracking, toggleGPStracking, location } = this.props;

    let markerPosition;
    if (location && location.latitude) {
      markerPosition = { lat: location.latitude, lon: location.longitude };
    }

    return (
      <IonContent>
        <IonToolbar id="location-toolbar">{this.getToolbar()}</IonToolbar>
        <Map ref={this.map} zoom={DEFAULT_ZOOM} onClick={this.handleClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.mapbox.com/styles/v1/cehapps/cipqvo0c0000jcknge1z28ejp/tiles/256/{z}/{x}/{y}?access_token={accessToken}"
            accessToken={CONFIG.map.mapbox_api_key}
          />
          <LeafletControl position="topleft">
            <button
              className={`geolocate-btn ${isGPSTracking ? 'spin' : ''}`}
              onClick={toggleGPStracking}
            >
              <IonIcon icon={locate} mode="md" size="large" />
            </button>
          </LeafletControl>

          {markerPosition && <Marker position={markerPosition} />}
        </Map>
      </IonContent>
    );
  }
}

export default LocationAttr;
