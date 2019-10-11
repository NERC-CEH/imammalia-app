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
              `The iMammalia App is designed to encourage recording of mammals in the wild. This (beta) test version is set up to easily record mammals in four pilot countries: Spain, Germany, Poland and Croatia. Sightings can be recorded from other countries across Europe, but currently the species list is limited to larger mammals found in those four countries.`
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
              `iMammalia is designed to make mammal recording easy. It holds a species list for Spain, Germany, Poland and Croatia but does not limit where you can record these animals. Smaller mammals are currently only listed at the generic level since they are much harder to tell apart. Later versions will include more countries, languages and species subject to funding.`
            )}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            {t(
              `Users must first register, and can then log into a web site to view and correct records. Choice of country can be reviewed in the settings.`
            )}
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
              'Agency specializing in building bespoke data oriented sollutions.'
            )}{' '}
            {t('For suggestions and feedback please do not hesitate to')}{' '}
            <a href="mailto:info%40flumens.io?subject=iMammalia%20App">
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
