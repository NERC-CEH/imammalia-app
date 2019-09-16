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

const Component = ({ species }) => {
  return (
    <IonContent id="species-profile" class="ion-padding">
      <img src={`/images/${species.id}.jpg`} alt="species" />

      <IonCardHeader>
        <IonCardSubtitle>{species.taxon}</IonCardSubtitle>
        <IonCardTitle>{t(species.english)}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>{t(species.description)}</IonCardContent>
    </IonContent>
  );
};

Component.propTypes = {
  species: PropTypes.object.isRequired,
};

export default Component;
