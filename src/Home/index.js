import React from 'react';
import { Route } from 'react-router-dom';
import {
  IonTabs,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonRouterOutlet,
} from '@ionic/react';
import { person, add, helpCircle, menu, home } from 'ionicons/icons';
import savedSamples from 'saved_samples';
import appModel from 'app_model';
import PrivateRoute from 'Components/PrivateRoute';
import Species from './Species';
import Help from './Help';
import UserRecords from './Records';
import './styles.scss';

const Component = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route
        path="/home/species"
        render={() => (
          <Species appModel={appModel} savedSamples={savedSamples} />
        )}
        exact
      />
      <Route path="/home/help" component={Help} exact />
      <PrivateRoute
        path="/home/user-records"
        component={() => <UserRecords savedSamples={savedSamples} />}
        exact
      />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="home/species" href="/home/species">
        <IonIcon icon={home} />
        <IonLabel>{t('Home')}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="/home/user-records" href="/home/user-records">
        <IonIcon icon={person} />
        <IonLabel>{t('Records')}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="record" class="add-record" href="/record/new/edit">
        <IonIcon icon={add} />
      </IonTabButton>
      <IonTabButton tab="help" href="/home/help">
        <IonIcon icon={helpCircle} />
        <IonLabel>{t('Help')}</IonLabel>
      </IonTabButton>
      <IonTabButton tab="menu" href="/info/menu">
        <IonIcon icon={menu} />
        <IonLabel>{t('Menu')}</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

Component.propTypes = {};

export default Component;
