const pkg = require('../../package.json');

const build = process.env.BITRISE_BUILD_NUMBER || pkg.build;
const OFFSET = 300000000;

module.exports = (grunt) => ({
  // Cordova config changes
  cordova_config: {
    src: ['cordova.xml'],
    dest: 'dist/cordova/config.xml',
    replacements: [
      {
        from: /\{ID\}/g, // string replacement
        to: () => pkg.id,
      },
      {
        from: /\{APP_VER\}/g, // string replacement
        to: () => pkg.version,
      },
      {
        from: /\{APP_TITLE\}/g,
        to: () => pkg.title,
      },
      {
        from: /\{APP_DESCRIPTION\}/g,
        to: () => pkg.description,
      },
      {
        from: /\{BUNDLE_VER\}/g,
        to: () => build,
      },
      {
        from: /\{ANDROID_BUNDLE_VER\}/g,
        to() {
          let version = OFFSET + parseInt(build);
          if (!grunt.option('oldversion')) {
            version += 8;
          }
          return version;
        },
      },
    ],
  },
});
