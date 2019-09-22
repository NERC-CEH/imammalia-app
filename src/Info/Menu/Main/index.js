import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  IonContent,
  IonIcon,
  IonList,
  IonItem,
  IonItemDivider,
} from '@ionic/react';
import { settings, exit, person, personAdd, lock, heart } from 'ionicons/icons';
import './styles.scss';

const Component = observer(({ isLoggedIn, user, logOut }) => {
  return (
    <IonContent class="app-menu">
      <IonList lines="full">
        {isLoggedIn && (
          <IonItem detail id="logout-button" onClick={logOut}>
            <IonIcon icon={exit} size="small" slot="start" />
            {t('Logout')}
            {': '}
            {user.firstname} 
            {' '}
            {user.secondname}
          </IonItem>
        )}

        {!isLoggedIn && (
          <IonItem href="/user/login" detail>
            <IonIcon icon={person} size="small" slot="start" />
            {t('Login')}
          </IonItem>
        )}

        {!isLoggedIn && (
          <IonItem href="/user/register" detail>
            <IonIcon icon={personAdd} size="small" slot="start" />
            {t('Register')}
          </IonItem>
        )}

        <IonItemDivider>{t('Settings')}</IonItemDivider>
        <IonItem href="/settings/menu" detail>
          <IonIcon icon={settings} size="small" slot="start" />
          {t('App')}
        </IonItem>
        <IonItemDivider>{t('Info')}</IonItemDivider>
        <IonItem
          href="https://www.european-mammals.brc.ac.uk/privacy-notice"
          target="_blank"
          detail
        >
          <IonIcon icon={lock} size="small" slot="start" />
          {t('Privacy Policy')}
        </IonItem>
        <IonItem href="/info/credits" detail>
          <IonIcon icon={heart} size="small" slot="start" />
          {t('Credits')}
        </IonItem>
      </IonList>
    </IonContent>
  );
});

Component.propTypes = {
  logOut: PropTypes.func,
  isLoggedIn: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

export default Component;
