import { FC, useEffect, useState, useRef } from 'react';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
  IonModal,
} from '@ionic/react';
import { ReactSVG } from 'react-svg';
import MapBackground from '-!react-svg-loader!../../maps/background.svg'; //eslint-disable-line
import { Trans as T, useTranslation } from 'react-i18next';
import { MapContainer } from 'react-leaflet';
import Leaflet, { LatLngBoundsExpression } from 'leaflet';
import { Main, ModalHeader } from '@flumens';
import { Species } from 'common/Components/SpeciesList';
import './styles.scss';

const habitats = [
  'aquatic',
  'river',
  'tree',
  'underground',
  'forest',
  'shrubs',
  'alpine',
  'prairies',
  'farmlands',
];

const MAMMALNET_SPECIES_BASE_URL = 'https://mammalnet.com/species';

const SVG_BOUNDS: LatLngBoundsExpression = [
  [0, 0],
  [300, 400],
];

type Props = {
  species: Species;
  onClose: any;
};

const SpeciesProfile: FC<Props> = ({ species, onClose }) => {
  const { t } = useTranslation();
  const [map, setMap]: any = useState(null);

  const svgOverlay = useRef<any>(null);

  const assignRef = (mapRef: Leaflet.Map) => setMap(mapRef);

  const refreshMapPositionAndZoom = () => {
    if (!map) return;

    Leaflet.svgOverlay(svgOverlay.current, SVG_BOUNDS).addTo(map);
    map.fitBounds(SVG_BOUNDS);

    map.invalidateSize();
  };

  useEffect(refreshMapPositionAndZoom, [map]);

  const { mammalnet_website_path: webPath } = species || {};
  const url = `${MAMMALNET_SPECIES_BASE_URL}/${webPath}`;

  const getHabitats = () =>
    habitats
      .filter(habitat => (species as any)[habitat])
      .map(habitat => t(habitat))
      .join(', ');

  const recalculateMapSize = () => map?.invalidateSize();

  return (
    <IonModal
      isOpen={!!species}
      backdropDismiss={false}
      onIonModalDidPresent={recalculateMapSize}
    >
      <ModalHeader title="Species" onClose={onClose} />
      {species && (
        <Main id="species-profile">
          <img src={`/images/${species.id}.jpg`} alt="species" />

          <IonCardHeader>
            <IonCardTitle>
              <T>{species.english}</T>
            </IonCardTitle>
            <IonCardSubtitle>
              <i>{species.taxon}</i>
            </IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <h3 className="species-label">
              <T>Description</T>:
            </h3>
            <T>{species.description}</T>
          </IonCardContent>

          {getHabitats() && (
            <IonCardContent className="species-habitats">
              <h3 className="species-label">
                <T>Habitats</T>:
              </h3>
              {getHabitats()}
            </IonCardContent>
          )}

          <IonCardContent className="external-link">
            <h3 className="species-label">
              <T>Mammalnet</T>:{' '}
              <a href={url}>
                <T>web profile</T>
              </a>
            </h3>
          </IonCardContent>

          <IonCardContent>
            <h3 className="species-label">
              <T>Distribution</T>:
            </h3>
            <div style={{ display: 'none' }}>
              <MapBackground id="boundary" />
              <ReactSVG src={`/images/${species.taxon}.svg`} />
            </div>{' '}
            <svg
              ref={svgOverlay}
              viewBox="0 0 400 300"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              xlinkHref="http://www.w3.org/1999/xlink"
              version="2.0"
            >
              <use id="species-map-boundary" href="#boundary" />
              <use id="species-map-data" href="#map2svg" />
            </svg>
          </IonCardContent>

          <MapContainer
            whenCreated={assignRef}
            id="species-map"
            minZoom={0}
            zoom={0}
            maxZoom={2}
            crs={Leaflet.CRS.Simple}
          />
        </Main>
      )}
    </IonModal>
  );
};

export default SpeciesProfile;
