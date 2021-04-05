require('dotenv').config({ silent: true }); // get local environment variables from .env
const fs = require('fs');
const pkg = require('./package.json');

const build = process.env.BITRISE_BUILD_NUMBER || pkg.build;
const OFFSET = 300000000;

const replace = {
  // Cordova config changes
  config: {
    src: ['cordova.xml'],
    dest: 'cordova/config.xml',
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
          return OFFSET + parseInt(build);
        },
      },
    ],
  },
};

const exec = (grunt) => ({
  build: {
    command: 'npm run clean && NODE_ENV=production npm run build',
  },
  init: {
    command: 'cordova create cordova',
    stdout: true,
  },
  resources: {
    command: `mkdir -p resources &&
        
              cp -R other/designs/android resources &&
              cp -R other/designs/*.png resources &&

              ./node_modules/.bin/cordova-res --resources resources`,
  },
  clean_www: {
    command: 'rm -R -f cordova/www/* && rm -f cordova/config.xml',
    stdout: true,
  },
  copy_dist: {
    command: 'cp -R build/* cordova/www/',
    stdout: true,
  },
  add_platforms: {
    // @6.4.0 because of https://github.com/ionic-team/ionic/issues/13857#issuecomment-381744212
    command: 'cd cordova && cordova platforms add ios android',
    stdout: true,
  },
  /**
   * $ANDROID_KEYSTORE must be set up to point to your android certificates keystore
   */
  android_build: {
    command() {
      const pass = process.env.BITRISEIO_ANDROID_KEYSTORE_PASSWORD;
      const keystore = process.env.BITRISEIO_ANDROID_KEYSTORE_URL.replace(
        'file://',
        ''
      );

      return `cd cordova && 
          mkdir -p dist && 
          cordova --release build android && 
          cd platforms/android/app/build/outputs/apk/release/ &&
          jarsigner -keystore ${keystore} 
            -storepass ${pass} app-release-unsigned.apk irecord &&
          zipalign 4 app-release-unsigned.apk main.apk && 
          mv -f main.apk ../../../../../../../dist/`;
    },

    stdout: true,
    stdin: true,
  },

  build_ios: {
    command: 'cd cordova && cordova build ios',
    stdout: true,
  },

  android: {
    command: 'cd cordova && cordova build android',
    stdout: true,
  },
});

function init(grunt) {
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.initConfig({
    exec: exec(grunt),
    replace,
  });
}

module.exports = (grunt) => {
  init(grunt);

  grunt.registerTask('default', [
    'exec:build',

    'exec:init',
    'exec:resources',

    'exec:clean_www',
    'exec:copy_dist',
    'replace:config',
    'exec:add_platforms',

    'exec:android_build',
    'exec:build_ios',

    'checklist',
  ]);

  grunt.registerTask('checklist', () => {
    const Reset = '\x1b[0m';
    const FgGreen = '\x1b[32m';
    const FgYellow = '\x1b[33m';
    const FgCyan = '\x1b[36m';

    const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8');

    const versionExistsInChangelog = changelog.includes(pkg.version);
    if (!versionExistsInChangelog) {
      console.log(FgYellow);
      console.log('WARN:');
      console.log(`* Have you updated CHANGELOG.md?`);
    } else {
      console.log(FgGreen);
      console.log('Success! 👌');
    }

    console.log(FgCyan);
    console.log('NEXT:');
    console.log(`* Update screenshots.`);
    console.log(`* Update descriptions.`);

    console.log(Reset);
  });
};
