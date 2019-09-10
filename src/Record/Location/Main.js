import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IonIcon,
  IonContent,
  IonLifeCycleContext,
} from '@ionic/react';
import { locate } from 'ionicons/icons';
import CONFIG from 'config';
import L from 'leaflet';
import GPS from 'helpers/GPS';
import { Map, TileLayer } from 'react-leaflet';
import LeafletControl from 'react-leaflet-control';
import { observer } from 'mobx-react';

L.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/';

const DEFAULT_POSITION = [51.505, -0.09];
const DEFAULT_ZOOM = 5;
const DEFAULT_LOCATED_ZOOM = 18;

@observer
class LocationAttr extends Component {
  static contextType = IonLifeCycleContext;

  static propTypes = {
    isGPSTracking: PropTypes.bool.isRequired,
  };

  state = {
    locating: false,
  };

  constructor(props) {
    super(props);
    this.map = React.createRef();
  }

  componentDidMount() {
    const map = this.map.current.leafletElement;
    map.panTo(new L.LatLng(...DEFAULT_POSITION));
  }

  onGeolocate = async () => {
    if (this.state.locating) {
      this.stopGPS();
      return;
    }
    const location = await this.startGPS();
    const map = this.map.current.leafletElement;
    map.setView(
      new L.LatLng(location.latitude, location.longitude),
      DEFAULT_LOCATED_ZOOM
    );
  };

  startGPS = () => {
    return new Promise((resolve, reject) => {
      const options = {
        accuracyLimit: 160,

        onUpdate: () => {},

        callback: (error, location) => {
          this.stopGPS();

          if (error) {
            this.stopGPS();
            reject(error);
            return;
          }
          resolve(location);
        },
      };

      const locatingJobId = GPS.start(options);
      this.setState({ locating: locatingJobId });
    });
  };

  stopGPS = () => {
    GPS.stop(this.state.locating);
    this.setState({ locating: false });
  };

  componentWillUnmount() {
    if (this.state.locating) {
      this.stopGPS();
    }
  }

  render() {
    const { isGPSTracking } = this.props;
    return (
      <IonContent className={`${isGPSTracking ? 'GPStracking' : ''}`}>
        <Map ref={this.map} zoom={DEFAULT_ZOOM} onClick={this.handleClick}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://api.mapbox.com/styles/v1/cehapps/cipqvo0c0000jcknge1z28ejp/tiles/256/{z}/{x}/{y}?access_token={accessToken}"
            accessToken={CONFIG.map.mapbox_api_key}
          />
          <LeafletControl position="topleft">
            <button
              className={`geolocate-btn ${this.state.locating ? 'spin' : ''}`}
              onClick={this.onGeolocate}
            >
              <IonIcon icon={locate} mode="md" size="large" />
            </button>
          </LeafletControl>
        </Map>
      </IonContent>
    );
  }
}

export default LocationAttr;
