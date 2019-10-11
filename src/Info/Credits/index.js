import React from 'react';
import { IonContent, IonList, IonItem, IonLabel, IonPage } from '@ionic/react';
import AppHeader from 'Components/Header';
import species from 'Home/Species/species.data.json';
import './styles.scss';

export default () => (
  <IonPage>
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
        <IonItem lines="none">
          <IonLabel>
            {t(`Icons made by`)}{' '}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{' '}
            {t('from')}{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </IonLabel>
        </IonItem>
      </IonList>

      <IonList lines="none">
        <IonItem lines="inset">
          <IonLabel>
            <b>
              {t(
                'We are very grateful for all the people that helped to create this app:'
              )}
            </b>
          </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>David Roy</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Karolis Kazlauskis</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Graham Smith</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Joaquin Vicente</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Jose A Blanco</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Oliver Keuling</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Karolina Petrović</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Massimo Scandura</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Nikica Šprem</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Nera Fabijanić</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Carmen Ruiz</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Javier Fernández López</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Phil Stephens</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Lucy Zhang</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Sammy Mason</IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Emily Townley </IonLabel>
        </IonItem>
        <IonItem>
          <IonLabel>Magnus Bower</IonLabel>
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
  </IonPage>
);
