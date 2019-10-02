import React from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import AppHeader from 'common/Components/Header';
import species from 'Home/Species/species.data.json';
import './styles.scss';

export default () => (
  <>
    <AppHeader title={t('Credits')} />
    <IonContent id="credits" class="ion-padding">
      <IonList lines="none">
        <IonItem>
          <IonLabel>
            {t(
              'We are very grateful for all the people that helped to create this app:'
            )}
          </IonLabel>
        </IonItem>
        <ul>
          <li>
            <a href="https://www.ceh.ac.uk/staff/david-roy">
              <b>David Roy</b> (the Centre for Ecology & Hydrology)
            </a>
          </li>
          <li>
            <a href="https://flumens.io">
              <b>Karolis Kazlauskis</b> (App developer)
            </a>
          </li>
        </ul>
      </IonList>

      <IonList>
        <IonItem>
          <IonLabel>
            {t('This App was produced through MammalNet and funded by EFSA.')}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            {`${t('Maps produced')} © Societas Europaea Mammalogica 2019`}
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            Icons made by{' '}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{' '}
            from{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </IonLabel>
        </IonItem>
      </IonList>

      <IonList>
        <IonItem>
          <IonLabel>{t('Photo credits:')}</IonLabel>
        </IonItem>
        <IonItem>
          {species
            .filter(s => s.photoAttribution)
            .map(s => (
              <li key={s.id}>
                <IonLabel position="stacked">
                  <b>{`${s.taxon}: `}</b>
                  <span
                    dangerouslySetInnerHTML={{ __html: s.photoAttribution }}
                  />
                </IonLabel>
              </li>
            ))}
        </IonItem>
      </IonList>
    </IonContent>
  </>
);
