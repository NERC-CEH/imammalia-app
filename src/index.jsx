// polyfills for Android 5.0
import 'core-js/features/map';
import 'core-js/features/set';

import ReactDOM from 'react-dom';
import { setupIonicReact } from '@ionic/react';
// import config from 'config';
import { configure as mobxConfig } from 'mobx';
import appModel from 'app_model';
import userModel from 'models/user';
import savedSamples from 'saved_samples';
// import { initAnalytics } from '@apps';
import App from './App';

import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import './common/theme.scss';

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
setupIonicReact({
  hardwareBackButton: false,
});
// END Android back button disable

mobxConfig({ enforceActions: 'never' });

async function init() {
  await appModel._init;
  await userModel._init;
  await savedSamples._init;

  // appModel.attrs.sendAnalytics &&
  //   initAnalytics({
  //     dsn: config.sentryDNS,
  //     environment: config.environment,
  //     build: config.build,
  //     release: config.version,
  //     userId: userModel.attrs.drupalID,
  //     tags: {
  //       'app.appSession': appModel.attrs.appSession,
  //     },
  //   });

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
