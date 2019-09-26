import React from 'react';
import {
  IonContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';
import PropTypes from 'prop-types';
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

const Component = ({ species }) => {
  const habitatsString = habitats
    .filter(habitat => species[habitat])
    .map(habitat => t(habitat))
    .join(', ');

  return (
    <IonContent id="species-profile" class="ion-padding">
      <img src={`/images/${species.id}.jpg`} alt="species" />

      <IonCardHeader>
        <IonCardTitle>{t(species.english)}</IonCardTitle>
        <IonCardSubtitle>{species.taxon}</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <h3 className="species-label">{`${t('Description')}:`}</h3>
        {t(species.description)}
      </IonCardContent>

      {habitatsString && (
        <IonCardContent className="species-habitats">
          <h3 className="species-label">{`${t('Habitats')}:`}</h3>
          {habitatsString}
        </IonCardContent>
      )}
    </IonContent>
  );
};

Component.propTypes = {
  species: PropTypes.object.isRequired,
};

export default Component;
