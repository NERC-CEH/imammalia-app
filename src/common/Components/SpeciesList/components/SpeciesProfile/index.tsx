import { FC } from 'react';
import {
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';
import { ReactSVG } from 'react-svg';
import MapBackground from '-!react-svg-loader!../../maps/background.svg'; //eslint-disable-line
import { Trans as T, useTranslation } from 'react-i18next';
import { MapContainer, SVGOverlay } from 'react-leaflet';
import { LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import { Main } from '@flumens';
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

const DEFAULT_CENTER: LatLngExpression | undefined = [51.494, -0.07];

const MAMMALNET_SPECIES_BASE_URL = 'https://mammalnet.com/species';

const BOUNDS: LatLngBoundsExpression = [
  [51.49, -0.08],
  [51.5, -0.06],
];

type Props = {
  species: Species;
};

const SpeciesProfile: FC<Props> = ({ species }) => {
  const { mammalnet_website_path: webPath } = species;
  const url = `${MAMMALNET_SPECIES_BASE_URL}/${webPath}`;
  const { t } = useTranslation();

  const habitatsString = habitats
    .filter(habitat => (species as any)[habitat])
    .map(habitat => t(habitat))
    .join(', ');

  return (
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

      {habitatsString && (
        <IonCardContent className="species-habitats">
          <h3 className="species-label">
            <T>Habitats</T>:
          </h3>
          {habitatsString}
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
      </IonCardContent>

      <MapContainer
        whenCreated={undefined}
        id="species-map"
        center={DEFAULT_CENTER}
        zoom={15}
      >
        <SVGOverlay bounds={BOUNDS}>
          <svg
            viewBox="0 0 400 300"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            xlinkHref="http://www.w3.org/1999/xlink"
            version="1.1"
          >
            <use id="species-map-boundary" href="#boundary" />
            <use id="species-map-data" href="#map2svg" />
          </svg>
        </SVGOverlay>
      </MapContainer>
    </Main>
  );
};

export default SpeciesProfile;
