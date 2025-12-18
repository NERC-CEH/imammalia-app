import { observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';
import {
  SamplesContext,
  TailwindBlockContext,
  TailwindContext,
  TailwindContextValue,
  defaultContext,
} from '@flumens';
import {
  IonApp as IonAppPlain,
  IonRouterOutlet,
  isPlatform,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import LanguageCountrySelectRequired from 'common/Components/LanguageCountrySelectRequired';
import appModel from 'common/models/app';
import samples from 'common/models/collections/samples';
import 'common/theme.css';
import 'common/translations/translator';
import Home from './Home';
import OnboardingScreens from './Info/Onboarding';
import Info from './Info/router';
import Settings from './Settings/router';
import Survey from './Survey/router';
import User from './User/router';

const platform = isPlatform('ios') ? 'ios' : 'android';
const tailwindContext: TailwindContextValue = { platform };
const tailwindBlockContext = {
  ...defaultContext,
  ...tailwindContext,
  basePath: '',
};

const samplesContext = { samples };

const HomeRedirect = () => <Redirect to="home" />;

const IonApp = IonAppPlain as any; // IonApp has 'lang' prop missing.

const App = () => (
  <IonApp lang={appModel.data.language}>
    <LanguageCountrySelectRequired appModel={appModel}>
      <OnboardingScreens>
        <TailwindContext.Provider value={tailwindContext}>
          <TailwindBlockContext.Provider value={tailwindBlockContext}>
            <SamplesContext.Provider value={samplesContext}>
              <IonReactRouter>
                <IonRouterOutlet id="main">
                  <Route exact path="/" component={HomeRedirect} />
                  <Route path="/home" component={Home} />
                  {User}
                  {Info}
                  {Survey}
                  {Settings}
                </IonRouterOutlet>
              </IonReactRouter>
            </SamplesContext.Provider>
          </TailwindBlockContext.Provider>
        </TailwindContext.Provider>
      </OnboardingScreens>
    </LanguageCountrySelectRequired>
  </IonApp>
);

export default observer(App);
