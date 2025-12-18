import { useEffect, useState, useRef } from 'react';
import Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Trans as T, useTranslation } from 'react-i18next';
import { MapContainer } from 'react-leaflet';
import { ReactSVG } from 'react-svg';
import { Main, ModalHeader } from '@flumens';
import { IonModal } from '@ionic/react';
import { Species } from 'common/Components/SpeciesList';
import MapBackground from '../../maps/background.svg?react';
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

const SVG_BOUNDS: [number, number][] = [
  [0, 0],
  [300, 400],
];

type Props = {
  species: Species;
  onClose: any;
};

const SpeciesProfile = ({ species, onClose }: Props) => {
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

          <div className="bg-white p-3">
            <h1 className="font-bold! my-0!">
              <T>{species.english}</T>
            </h1>
            <h2 className="font-semibold! opacity-50 capitalize my-0!">
              <i>{species.taxon}</i>
            </h2>
          </div>

          <div className="px-3">
            <div>
              <h3 className="species-label">
                <T>Description</T>:
              </h3>
              <T>{species.description}</T>
            </div>

            {getHabitats() && (
              <div className="species-habitats">
                <h3 className="species-label">
                  <T>Habitats</T>:
                </h3>
                {getHabitats()}
              </div>
            )}

            <div className="external-link">
              <h3 className="species-label">
                <T>Mammalnet</T>:{' '}
                <a href={url}>
                  <T>web profile</T>
                </a>
              </h3>
            </div>

            <div>
              <h3 className="species-label">
                <T>Distribution</T>:
              </h3>
              <div style={{ display: 'none' }}>
                <MapBackground id="boundary" />
                <ReactSVG src={`/images/${species.taxon}.svg`} />
              </div>
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
            </div>
          </div>
          <MapContainer
            ref={assignRef}
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
