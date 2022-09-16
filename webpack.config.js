require('dotenv').config({ silent: true });
const webpack = require('webpack');
const appConfig = require('@flumens/webpack-config');

const required = [
  'APP_BACKEND_CLIENT_ID',
  'APP_BACKEND_CLIENT_PASS',
  'APP_MAPBOX_MAP_KEY',
  'APP_SENTRY_KEY',
  'APP_INDICIA_API_KEY',
];

const development = {
  APP_BACKEND_INDICIA_URL: '',
  APP_BACKEND_URL: '',
};

appConfig.plugins.unshift(
  new webpack.EnvironmentPlugin(required),
  new webpack.EnvironmentPlugin(development)
);

module.exports = appConfig;
