// polyfills for Android 5.0
import 'core-js/features/map';
import 'core-js/features/set';

import React from 'react';
import ReactDOM from 'react-dom';
import { setupConfig } from '@ionic/react';
import config from 'config';
import appModel from 'app_model';
import userModel from 'user_model';
import savedSamples from 'saved_samples';
import { initAnalytics } from '@apps';
import App from './App';

// Fixes Ionic + Webpack issue - TODO: remove once no longer needed
window.process = { env: {} };

// START Android back button disable
function disableBackButton() {
  document.addEventListener(
    'backbutton',
    event => {
      event.preventDefault();
      event.stopPropagation();
    },
    false
  );
}
setupConfig({
  hardwareBackButton: false,
});
// END Android back button disable

async function init() {
  await appModel._init;
  await userModel._init;
  await savedSamples._init;

  initAnalytics({
    dsn: config.sentryDNS,
    environment: config.environment,
    build: config.build,
    release: config.version,
    userId: userModel.attrs.drupalID,
    tags: {
      'app.appSession': appModel.attrs.appSession,
    },
  });

  appModel.attrs.appSession += 1;
  appModel.save();

  if (window.cordova) {
    document.addEventListener(
      'deviceready',
      () => {
        if (navigator && navigator.splashscreen) {
          navigator.splashscreen.hide();
        }
      },
      false
    );

    disableBackButton();
  }

  ReactDOM.render(<App />, document.getElementById('root'));
}

init();
