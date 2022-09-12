import { Filesystem, Directory } from '@capacitor/filesystem';
import { isPlatform } from '@ionic/react';

// const backendUrl = process.env.APP_BACKEND_URL || 'https://irecord.org.uk';

// const indiciaUrl =
//   process.env.APP_BACKEND_INDICIA_URL || 'https://warehouse1.indicia.org.uk';

// const backendUrl =
//   process.env.APP_BACKEND_URL || 'https://european-mammals.brc.ac.uk/';

const backendUrl = 'https://european-mammals.brc.ac.uk/';

const config = {
  environment: 'process.env.NODE_ENV as string',
  version: 'process.env.APP_VERSION as string',
  build: 'process.env.APP_BUILD as string',
  feedbackEmail: 'apps%40ceh.ac.uk',

  sentryDNS: 'process.env.APP_SENTRY_KEY as string',

  map: {
    mapboxApiKey: process.env.APP_MAPBOX_MAP_KEY as string,
    mapboxSatelliteId: 'cehapps/cipqvo0c0000jcknge1z28ejp',
  },

  backend: {
    url: backendUrl,
    websiteId: -1,
    clientId: 'process.env.APP_BACKEND_CLIENT_ID as string',
    clientPass: 'process.env.APP_BACKEND_CLIENT_PASS as string',

    indicia: {
      url: '',
    },
  },

  weatherSiteApiKey: 'process.env.APP_WEATHER_SITE_API_KEY as string',
  weatherSiteUrl: 'https://api.openweathermap.org/data/2.5/weather',

  dataPath: '',
};

(async function getMediaDirectory() {
  if (isPlatform('hybrid')) {
    const { uri } = await Filesystem.getUri({
      path: '',
      directory: Directory.Data,
    });
    config.dataPath = uri;
  }
})();

export default config;
