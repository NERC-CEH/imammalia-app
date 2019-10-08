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
        <IonItem lines="none">
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
            David Roy
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>
              Karolis Kazlauskis
          </IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Graham Smith</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Joaquin Vicente</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Jose A Blanco</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Oliver Keuling</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Karolina Petrović</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Massimo Scandura</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Nikica Šprem</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Nera Fabijanić</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Carmen Ruiz</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Javier Fernández López</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Phil Stephens</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Lucy Zhang</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Sammy Mason</IonLabel>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Emily Townley </IonLabel>
        </IonItem>
        <IonItem lines="none">
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
  </>
);
