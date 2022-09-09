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
import savedSamples from 'models/savedSamples';
import appModel from 'models/app';
import { Trans as T } from 'react-i18next';
import Species from './Species';
import Help from './Help';
import UserRecords from './Records';
import './styles.scss';

const Records = () => <UserRecords savedSamples={savedSamples} />;

const SpeciesWrap = () => (
  <Species appModel={appModel} savedSamples={savedSamples} />
);

const HomeComponent = () => (
  <IonTabs>
    <IonRouterOutlet>
      <Route path="/home/species" component={SpeciesWrap} exact />
      <Route path="/home/help" component={Help} exact />
      <Route path="/home/user-records" component={Records} exact />
    </IonRouterOutlet>

    <IonTabBar slot="bottom">
      <IonTabButton tab="home/species" href="/home/species">
        <IonIcon icon={home} />
        <IonLabel>
          <T>Home</T>
        </IonLabel>
      </IonTabButton>
      <IonTabButton tab="/home/user-records" href="/home/user-records">
        <IonIcon icon={person} />
        <IonLabel>
          <T>Records</T>
        </IonLabel>
      </IonTabButton>
      <IonTabButton tab="record" class="add-record" href="/record/main">
        <IonIcon icon={add} />
      </IonTabButton>
      <IonTabButton tab="help" href="/home/help">
        <IonIcon icon={helpCircle} />
        <IonLabel>
          <T>Help</T>
        </IonLabel>
      </IonTabButton>
      <IonTabButton tab="menu" href="/info/menu">
        <IonIcon icon={menu} />
        <IonLabel>
          <T>Menu</T>
        </IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
);

export default HomeComponent;
