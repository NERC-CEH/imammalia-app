/** ****************************************************************************
 * Print App information for debugging, BRC ACII art and a link to BRC website.
 **************************************************************************** */

import Indicia from 'indicia';
import CONFIG from 'config';
import Log from './log';

// Print Hello
const art = [
  '\n',
  '* Find me: https://kazlauskis.com',
].join('\n');

Log(art);

// Print System values
Log(`
* System info:
  Environment: ${CONFIG.environment}
  
  Version: ${CONFIG.version}
  Build: ${CONFIG.build}
  Indicia: ${Indicia.VERSION}
  
  Google Analytics: ${window.cordova && CONFIG.ga.id ? 'true' : 'false'}
  Server error logs: ${CONFIG.sentry.key ? 'true' : 'false'}


`);

// Print missing configuration errors
if (!CONFIG.indicia.api_key) {
  Log(
    'Indicia API key is missing! Set APP_INDICIA_API_KEY build env. variable.',
    'e'
  );
}

if (!CONFIG.map.mapbox_api_key) {
  Log(
    'Mapbox layers API key is missing! Set APP_MAPBOX_MAP_KEY build env. variable.',
    'e'
  );
}
