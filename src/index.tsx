import ReactDOM from 'react-dom';
import { setupIonicReact } from '@ionic/react';
import config from 'common/config';
import { configure as mobxConfig } from 'mobx';
import appModel from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import { initAnalytics, device } from '@flumens';
import App from './App';
import '@capacitor/core';
import '@ionic/core/css/core.css';
import '@ionic/core/css/ionic.bundle.css';
import 'leaflet/dist/leaflet.css';
import 'common/theme.scss';

console.log('🚩 App starting.');

setupIonicReact({
  hardwareBackButton: false,
  swipeBackEnabled: false,
});

mobxConfig({ enforceActions: 'never' });

async function init() {
  await appModel.ready;
  await userModel.ready;
  await savedSamples._init;

  appModel.attrs.sendAnalytics &&
    initAnalytics({
      dsn: config.sentryDNS,
      environment: config.environment,
      build: config.build,
      release: config.version,
      userId: userModel.id,
      tags: {
        'app.appSession': appModel.attrs.appSession,
      },
    });

  appModel.attrs.appSession += 1;
  appModel.save();

  if (userModel.attrs.password && device.isOnline) {
    // TODO: remove after this propagates to all users
    try {
      userModel._migrateAuth();
    } catch (_) {
      // do nothing
    }
  }

  ReactDOM.render(<App />, document.getElementById('root'));
}

init();
