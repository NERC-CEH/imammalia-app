import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { IonRouterOutlet } from '@ionic/react';
import savedSamples from 'saved_samples';
import appModel from 'app_model';
import userModel from 'user_model';
import Edit from './Edit';
import Location from './Location';
import Comment from './Comment';

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
        path="/record/:id/edit/comment"
        exact
        render={props => <Comment savedSamples={savedSamples} {...props} />}
      />
    </IonRouterOutlet>
  );
};
export default App;
