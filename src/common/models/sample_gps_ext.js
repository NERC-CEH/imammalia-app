/** ****************************************************************************
 * Indicia Sample geolocation functions.
 *
 * Sample geolocation events:
 * start, update, error, success, stop
 **************************************************************************** */
import GPS from 'helpers/GPS';
import Log from 'helpers/log';
import { observable } from 'mobx';

const DEFAULT_ACCURACY_LIMIT = 50; // meters

const extension = {
  setLocation([longitude, latitude], source = 'map', accuracy) {
    return this.save({
      location: {
        latitude,
        longitude,
        source,
        accuracy,
      },
    });
  },

  toggleGPStracking(state) {
    if (this.isGPSRunning() || state === false) {
      this.stopGPS();
      return;
    }

    this.startGPS();
  },

  gpsExtensionInit() {
    this.gps = observable({ locating: null });
  },

  startGPS(accuracyLimit = DEFAULT_ACCURACY_LIMIT) {
    Log('SampleModel:GPS: start.');

    // eslint-disable-next-line
    const that = this;
    const options = {
      accuracyLimit,

      onUpdate() {},

      callback(error, location) {
        if (error) {
          that.stopGPS();
          return;
        }

        if (location.accuracy <= options.accuracyLimit) {
          that.stopGPS();
        }

        that.setLocation(
          [parseInt(location.longitude, 10), parseInt(location.latitude, 10)],
          'gps',
          location.accuracy
        );
      },
    };

    this.gps.locating = GPS.start(options);
  },

  stopGPS() {
    Log('SampleModel:GPS: stop.');

    GPS.stop(this.gps.locating);
    this.gps.locating = null;
  },

  isGPSRunning() {
    return !!(this.gps.locating || this.gps.locating === 0);
  },
};

export { extension as default };
