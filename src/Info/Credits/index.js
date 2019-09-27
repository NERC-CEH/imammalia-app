import React from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import AppHeader from 'common/Components/Header';
import './styles.scss';

export default () => (
  <>
    <AppHeader title={t('Credits')} />
    <IonContent id="credits" class="ion-padding">
      <IonList lines="none">
        <IonItem>
          <IonLabel>
            {t('This App was produced through MammalNet and funded by EFSA.')}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            {t(
              'We are very grateful for all the people that helped to create this app:'
            )}
          </IonLabel>
        </IonItem>
        <ul>
          <ul>
            <li>
              <a href="https://www.ceh.ac.uk/staff/david-roy">
                <b>David Roy</b>
                {' '}
(the Centre for Ecology & Hydrology)
              </a>
            </li>
            <li>
              <a href="https://flumens.io">
                <b>Karolis Kazlauskis</b>
                {' '}
(App developer)
              </a>
            </li>
          </ul>
        </ul>
      </IonList>

      <IonList>
        <IonItem>
          <small>
            Icons made by
            {' '}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>
            {' '}
            from
            {' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </small>
        </IonItem>
      </IonList>
    </IonContent>
  </>
);
