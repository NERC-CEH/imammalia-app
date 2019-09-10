/** ****************************************************************************
 * Indicia Sample geolocation functions.
 *
 * Sample geolocation events:
 * start, update, error, success, stop
 **************************************************************************** */
import GPS from 'helpers/GPS';
import Log from 'helpers/log';
import { observable } from 'mobx';

export function updateSampleLocation(sample, { latitude, longitude }) {
  return sample.setLocation([longitude, latitude]);
}

const extension = {
  setLocation([longitude, latitude]) {
    return this.save({
      location: {
        latitude,
        longitude,
        source: 'map',
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

    // TODO: remove
    // window.testing.GPS.mock();
  },

  startGPS(accuracyLimit) {
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

        updateSampleLocation(that, location);
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
