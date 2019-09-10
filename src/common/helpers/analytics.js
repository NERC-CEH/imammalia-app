/**
 * Application analytics.
 *
 * Uses Google analytics to track the page navigation and Sentry to server log
 * client side errors.
 */
import Raven from 'raven-js';
import CONFIG from 'config';
import Log from './log';

function _removeUUID(string) {
  // remove specific UUIDs
  return string.replace(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    'UUID'
  );
}

export function removeUserId(URL) {
  return URL.replace(/\/users\/.*/g, '/users/USERID');
}

/* eslint-disable no-param-reassign */
export function breadcrumbCallback(crumb) {
  // clean UUIDs
  if (crumb.category === 'navigation') {
    crumb.data = {
      to: _removeUUID(crumb.data.to),
      from: _removeUUID(crumb.data.from),
    };
    return crumb;
  }
  if (crumb.category === 'xhr') {
    if (crumb.data.method === 'GET' && crumb.data.url.match(/jpeg$/i)) {
      crumb.data.url = crumb.data.url.replace(
        /files\/\d+\.jpeg/i,
        'files/FILENAME.jpeg'
      );
    }

    crumb.data = {
      url: removeUserId(crumb.data.url),
    };
    return crumb;
  }

  return crumb;
}
/* eslint-enable no-param-reassign */

function concatBreadcrumbs(breadcrumbs) {
  const cleanBreadcrumbs = [];
  let occurrences = 1;
  breadcrumbs.forEach((crumb, i) => {
    if (!cleanBreadcrumbs.length) {
      cleanBreadcrumbs.push(crumb);
      return;
    }

    const lastSavedCrumb = cleanBreadcrumbs[cleanBreadcrumbs.length - 1];
    // count for duplicate crumbs
    if (
      lastSavedCrumb.category === 'xhr' &&
      crumb.category === 'xhr' &&
      lastSavedCrumb.data.method === crumb.data.method &&
      lastSavedCrumb.data.url === crumb.data.url
    ) {
      occurrences++;
      if (i === breadcrumbs.length - 1) {
        lastSavedCrumb.data.url += `_x${occurrences}`;
        occurrences = 1;
      }
      return;
    }

    // print out counter to last duplicate crumb
    if (occurrences > 1) {
      lastSavedCrumb.data.url += `_x${occurrences}`;
      occurrences = 1;
    }

    cleanBreadcrumbs.push(crumb);
  });

  return cleanBreadcrumbs;
}

export function processBreadcrumbs(breadcrumbs) {
  breadcrumbs.map(breadcrumbCallback);
  return concatBreadcrumbs(breadcrumbs);
}

/* eslint-disable no-param-reassign */
export function dataCallback(data) {
  data.breadcrumbs.values = processBreadcrumbs(data.breadcrumbs.values);

  // maxBreadcrumbs is 100 only, see the _globalOptions change below
  const maxBreadcrumbs = 100;
  const maxIndex = Math.max(data.breadcrumbs.values.length - maxBreadcrumbs, 0);
  data.breadcrumbs.values.splice(0, maxIndex);

  data.culprit = _removeUUID(data.culprit || '');
  if (data.request && data.request.url) {
    data.request.url = _removeUUID(data.request.url);
  }
  return data;
}
/* eslint-enable no-param-reassign */

const API = {
  initialized: false,

  init() {
    Log('Analytics: initializing.');

    // initialize only once
    if (this.initialized) {
      return;
    }

    // Turn on the error logging
    if (CONFIG.sentry.key) {
      Log('Analytics: turning on server error logging.');
      Raven.config(
        `https://${CONFIG.sentry.key}@sentry.io/${CONFIG.sentry.project}`,
        {
          environment: CONFIG.environment,
          release: CONFIG.version,
          ignoreErrors: [
            'setSelectionRange', // there is some fastclick issue (does not affect ux)
            'Incorrect password or email', // no need to log that
            'Backbone.history', // on refresh fires this error, todo: fix it
          ],
          // breadcrumbCallback, // moved to dataCallback
          dataCallback,
        }
      ).install();

      // increase breadcrumbs captured before send
      // this is undocumented use of _globalOptions so might break in the future
      Raven._globalOptions.maxBreadcrumbs = 400;
      // console.log(Raven._globalOptions);
    } else {
      Log(
        'Analytics: server error logging is turned off. Please provide Sentry key.',
        'w'
      );
    }

    // capture unhandled promises
    window.onunhandledrejection = e => {
      Raven.captureException(e.reason, {
        extra: { unhandledPromise: true },
      });
    };

    if (window.cordova && CONFIG.ga.id) {
      document.addEventListener('deviceready', () => {
        Log('Analytics: turning on Google Analytics.');

        window.analytics.startTrackerWithId(CONFIG.ga.id);
        window.analytics.enableUncaughtExceptionReporting(true);

        // listen for page change
        // TODO: on page change do API.trackPage();

        this.initialized = true;
      });
    } else {
      Log(
        `Analytics: Google Analytics is turned off. ${
          window.cordova ? 'Please provide the GA tracking ID.' : ''
        }`,
        'w'
      );
    }
  },

  trackEvent(category, event) {
    if (!this.initialized) {
      return;
    }

    window.analytics.trackEvent(category, event);
  },
};

// init Analytics
API.init();

export { API as default };
