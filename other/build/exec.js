require('dotenv').config({ silent: true }); // get local environment variables from .env

module.exports = function(grunt) {
  return {
    ionic_copy: {
      command: 'cp -R node_modules/@ionic dist/main',
      stdout: true,
    },
    cordova_init: {
      command: 'cordova create dist/cordova',
      stdout: true,
    },
    cordova_clean_www: {
      command: 'rm -R -f dist/cordova/www/* && rm -f dist/cordova/config.xml',
      stdout: true,
    },
    cordova_rebuild: {
      command: 'cd dist/cordova/ && cordova prepare ios android',
      stdout: true,
    },
    cordova_android_build_dev: {
      command: 'cd dist/cordova/ && ../../node_modules/.bin/cordova build android',
      stdout: true,
    },
    cordova_copy_dist: {
      command: 'cp -R dist/main/* dist/cordova/www/',
      stdout: true,
    },
    cordova_add_platforms: {
      // @6.4.0 because of https://github.com/ionic-team/ionic/issues/13857#issuecomment-381744212
      command: 'cd dist/cordova && cordova platforms add ios android@6.4.0',
      stdout: true,
    },
    /**
     * $ANDROID_KEYSTORE must be set up to point to your android certificates keystore
     */
    cordova_android_build: {
      command() {
        const pass = grunt.config('keystore-password');
        return `cd dist/cordova && 
            mkdir -p dist && 
            cordova --release build android && 
            cd platforms/android/build/outputs/apk/release/ &&
            jarsigner -sigalg SHA1withRSA -digestalg SHA1 
              -keystore ${process.env.KEYSTORE} 
              -storepass ${pass} android-release-unsigned.apk irecord &&
            zipalign 4 android-release-unsigned.apk main.apk && 
            mv -f main.apk ../../../../../../dist/`;
      },

      stdout: true,
      stdin: true,
    },

    cordova_build_ios: {
      command: 'cd dist/cordova && cordova build ios',
      stdout: true,
    },

    cordova_build_android: {
      command: 'cd dist/cordova && cordova build android',
      stdout: true,
    },
  };
};
