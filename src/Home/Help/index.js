import React from 'react';
import {
  IonContent,
  IonList,
  IonItemDivider,
  IonIcon,
  IonPage,
} from '@ionic/react';
import { settings, undo, person, add, send } from 'ionicons/icons';
import Collapse from 'Components/Collapse/index';
import './styles.scss';

export default () => (
  <IonPage>
    <IonContent id="help" class="ion-padding">
      <IonList lines="none">
        <IonItemDivider>{t('Records')}</IonItemDivider>
        <Collapse title={t('How to start a record')}>
          <p>
            {t('To start a new record you can press the plus button')}
            <IonIcon icon={add} />
            {t('in the home page footer.')}
            <br />
            <br />
            {t(
              'When finished, set for submission by pressing the Finish button in the header.'
            )}
          </p>
        </Collapse>

        <Collapse title={t('Sync. with the website')}>
          <p>
            {t('All your saved records will be shown on your account page.')}
            <IonIcon icon={person} />
            <br />
            <br />
            {t(
              `By default a record is in a 'draft' mode which will not be sent to the database until the 'Finish' button in the header is clicked. The application will try to submit your record once there is a good network connection.`
            )}
            <br />
            <br />
            {t('If the record has reached the database a red')}{' '}
            <IonIcon icon={send} style={{ color: 'red' }} />
            {t('(set for submission & saved locally) will become green')}{' '}
            <IonIcon icon={send} style={{ color: 'green' }} /> (
            {t('synced to the database')}
            ).
            <br />
            <br />
            <b>{t('Note')}:</b>{' '}
            {t(
              'you have to be signed in to your website account and have a network connection, for the records to be automatically synchronised in the background'
            )}
            .
            <br />
          </p>
        </Collapse>
        <Collapse title={t('Delete a record')}>
          <p>
            {t(
              'To delete a record, swipe it left in your account page and click the delete button.'
            )}
          </p>
        </Collapse>

        <IonItemDivider>{t('User')}</IonItemDivider>
        <Collapse title={t('Sign in/out or register')}>
          <p>
            {t(
              'To login, open the main menu page click Login or Register buttons and follow the instructions.'
            )}
            <br />
            <br />
            {t(
              'To logout, visit the main menu page and click the logout button.'
            )}
            .
            <br />
            <br />
            <b>{t('Note')}:</b>{' '}
            {t(
              'after registering a new account you must verify your email address by clicking on a verification link sent to your email'
            )}
            .
          </p>
        </Collapse>

        <IonItemDivider>{t('Other')}</IonItemDivider>
        <Collapse title={t('Reset the application')}>
          <p>
            {t('Go to the application settings page')}{' '}
            <IonIcon icon={settings} /> {t('and click on the Reset')}{' '}
            <IonIcon icon={undo} />
            {t('button')}.
          </p>
        </Collapse>
      </IonList>
    </IonContent>
  </IonPage>
);
