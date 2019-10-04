import React from 'react';
import { IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import AppHeader from 'Components/Header';
import species from 'Home/Species/species.data.json';
import './styles.scss';

export default () => (
  <>
    <AppHeader title={t('Credits')} />
    <IonContent id="credits" class="ion-padding">
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
          <IonLabel>
            <b>
              {t(
                'We are very grateful for all the people that helped to create this app:'
              )}
            </b>
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
            <a href="https://www.ceh.ac.uk/staff/david-roy">
              <b>David Roy</b> (the Centre for Ecology & Hydrology)
            </a>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>
            <a href="https://flumens.io">
              <b>Karolis Kazlauskis</b> (App developer)
            </a>
          </IonLabel>
        </IonItem>
      </IonList>

      <IonList>
        <IonItem>
          <IonLabel>
            <b>{t('Photo credits:')}</b>
          </IonLabel>
        </IonItem>
        {/* <IonItem> */}
        {species
          .filter(s => s.photoAttribution)
          .map(s => (
            <IonItem key={s.id} lines="none">
              <IonLabel>
                <i>{`${s.taxon}: `}</i>
                <span
                  dangerouslySetInnerHTML={{ __html: s.photoAttribution }}
                />
              </IonLabel>
            </IonItem>
          ))}
        {/* </IonItem> */}
      </IonList>
    </IonContent>
  </>
);
