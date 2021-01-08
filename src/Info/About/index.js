import React from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonListHeader,
  IonLabel,
  IonPage,
} from '@ionic/react';
import AppHeader from 'Components/Header';
import './styles.scss';

const Component = () => (
  <IonPage>
    <AppHeader title={t('About')} />
    <IonContent id="about" class="ion-padding">
      <IonList lines="none">
        <IonItem>
          <IonLabel>
            {t(
              `The iMammalia App is designed to encourage recording of mammals in the wild. This version of the mobile application is set up to easily record mammals in any European country, but does not yet have all European languages included.`
            )}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            {t(
              `Sightings can be recorded anywhere, with or without photos, and all records will be verified by experts and made available to help with mapping the distribution of European mammals. You can check and update your records online.`
            )}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            {t(
              `iMammalia is designed to make mammal recording easy. Smaller mammals are currently only listed at the generic level since they are much harder to tell apart. Later versions will include more countries, languages and species subject to funding.`
            )}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            {t(
              `Users must first register, and can then log into a web site to view and correct records. Choice of country can be reviewed in the settings.`
            )}
            <br />
            <br />
            <a href="https://european-mammals.brc.ac.uk">
              https://european-mammals.brc.ac.uk
            </a>
          </IonLabel>
        </IonItem>
        <IonListHeader color="light" mode="ios">
          <IonLabel>{t('App Development')}</IonLabel>
        </IonListHeader>
        <IonItem>
          <IonLabel>
            {t('This app was hand crafted with love by')}
            <a href="https://flumens.io" style={{ whiteSpace: 'nowrap' }}>
              {' '}
              Flumens.
            </a>{' '}
            {t(
              'Agency specializing in building bespoke data oriented solutions.'
            )}{' '}
            {t('For suggestions and feedback please do not hesitate to')}{' '}
            <a href="mailto:imammalia%40ceh.ac.uk?subject=iMammalia%20App">
              {t('contact us')}
            </a>
            .
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  </IonPage>
);

Component.propTypes = {};

export default Component;
