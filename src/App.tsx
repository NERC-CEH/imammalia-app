import { FC } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonApp as IonAppPlain, IonRouterOutlet } from '@ionic/react';
import { observer } from 'mobx-react';
import { IonReactRouter } from '@ionic/react-router';
import appModel from 'models/app';
import LanguageCountrySelectRequired from 'Components/LanguageCountrySelectRequired';
import Home from './Home';
import SplashScreenRequired from './Info/SplashScreenRequired';
import Settings from './Settings/router';
import Record from './Record/router';
import Info from './Info/router';
import User from './User/router';
import './common/translations/translator';

const HomeRedirect = () => <Redirect to="/home/species" />;

const IonApp = IonAppPlain as any as FC<{ lang: any }>; // IonApp has 'lang' prop missing.

const App = () => {
  const { language } = appModel.attrs;

  return (
    <IonApp lang={language}>
      <LanguageCountrySelectRequired appModel={appModel}>
        <SplashScreenRequired>
          <IonReactRouter>
            <IonRouterOutlet id="main">
              <Route exact path="/" component={HomeRedirect} />
              <Route path="/home" component={Home} />
              {User}
              {Settings}
              {Info}
              {Record}
            </IonRouterOutlet>
          </IonReactRouter>
        </SplashScreenRequired>
      </LanguageCountrySelectRequired>
    </IonApp>
  );
};

export default observer(App);
