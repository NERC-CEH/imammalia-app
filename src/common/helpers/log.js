/** ****************************************************************************
 * Takes care of application execution logging.
 *
 * Depends on indicia.
 *
 * Uses 5 levels of logging:
 *  0: none
 *  1: errors
 *  2: warnings
 *  3: information
 *  4: debug
 *
 * Levels values defined in core app module.
 **************************************************************************** */
import Raven from 'raven-js';
import CONFIG from 'config';

const ERROR = 'e';
const WARNING = 'w';
const INFO = 'i';
const DEBUG = 'd';

function _removeUUID(string) {
  // remove UUIDs
  return string.replace(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
    'UUID'
  );
}

/**
 * Prints and posts an error to the mobile authentication log.
 *
 * @param error Object holding a 'message', and optionally 'url' and 'line' fields.
 *              String holding a 'message
 * @private
 */
function error(err = {}) {
  const isString = typeof err === 'string' || err instanceof String;
  const e = isString
    ? {
      message: err,
    }
    : err;

  if (Raven) {
    if (typeof e.stack === 'string') {
      e.stack = _removeUUID(e.stack);
    }
    Raven.captureException(e, { culprit: null }); // culprit=null to remove UUIDS from iOS files
  }

  console.error(e.message, e.url, e.line, e.column, e.obj);
}

function log(message, type = DEBUG) {
  // always print errors
  if (type === ERROR) {
    error(message);
    return;
  }

  // do nothing if logging turned off
  if (CONFIG.log) {
    switch (type) {
      case WARNING:
        console.warn(message);
        break;
      case INFO:
        console.log(message);
        break;
      case DEBUG:
      /* falls through */
      default:
        // IE does not support console.debug
        if (!console.debug) {
          console.log(message);
          break;
        }
        console.debug(message);
    }
  }
}

export { log as default };
