import React from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonListHeader,
  IonLabel,
} from '@ionic/react';
import AppHeader from 'common/Components/Header';
import './styles.scss';

export default () => (
  <>
    <AppHeader title={t('Credits')} />
    <IonContent id="credits" class="ion-padding">
      <IonList lines="none">
        <IonListHeader color="light" mode="ios">
          <IonLabel>
            {t(
              'We are very grateful for all the people that helped to create this app:'
            )}
          </IonLabel>
        </IonListHeader>
        <IonItem>
          <p><b>TODO</b></p>
        </IonItem>
      </IonList>
    </IonContent>
  </>
);