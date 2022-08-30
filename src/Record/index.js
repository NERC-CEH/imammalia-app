import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import savedSamples from 'saved_samples';
import appModel from 'app_model';
import userModel from 'models/user';
import Taxa from './Taxa';
import Edit from './Edit';
import Location from './Location';
import Attr from './Attr';

const App = routeProps => {
  if (!userModel.hasLogIn()) {
    return (
      <Redirect
        push
        to={{
          pathname: '/user/login',
          state: { from: routeProps && routeProps.location, direction: 'root' },
        }}
      />
    );
  }

  return (
    <IonRouterOutlet>
      <Route
        path="/record/:id/edit/species"
        exact
        render={props => (
          <Taxa savedSamples={savedSamples} appModel={appModel} {...props} />
        )}
      />
      <Route
        path="/record/:id/edit/location"
        exact
        render={props => <Location savedSamples={savedSamples} {...props} />}
      />
      <Route
        path="/record/:id/edit"
        exact
        render={props => (
          <Edit savedSamples={savedSamples} appModel={appModel} {...props} />
        )}
      />
      <Route
        path="/record/:id/edit/:attr"
        exact
        render={props => <Attr savedSamples={savedSamples} {...props} />}
      />
    </IonRouterOutlet>
  );
};
export default App;
