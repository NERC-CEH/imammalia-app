// import React from 'react';
import { RouteWithModels, AttrPage } from '@flumens';
import appModel from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import Species from './Species';
import NumberAttr from './NumberAttr';
// import CONFIG from 'common/config';
import ModelLocation from './Location';
import StartNewSurvey from './StartNewRecord';
import survey from './config';
import Home from './Home';

const baseURL = `/record/${survey.name}`;

const HomeWrap = (props: any) => (
  <Home appModel={appModel} userModel={userModel} {...props} />
);

const { AttrPageFromRoute } = AttrPage;

const routes = [
  [`${baseURL}`, StartNewSurvey.with(survey), true],
  [`${baseURL}/:smpId`, HomeWrap],
  [`${baseURL}/:smpId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/:occId/:attr`, AttrPageFromRoute],
  [`${baseURL}/:smpId/:occId/number`, NumberAttr],
  [`${baseURL}/:smpId/location`, ModelLocation],
  [`${baseURL}/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(savedSamples, routes);
