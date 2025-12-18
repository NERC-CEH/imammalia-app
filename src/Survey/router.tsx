import { RouteWithModels, AttrPage } from '@flumens';
import appModel from 'models/app';
import samples from 'models/collections/samples';
import Home from './Home';
import ModelLocation from './Location';
import Species from './Species';
import StartNewSurvey from './StartNewRecord';
import NumberAttr from './common/Components/NumberAttr';
import survey from './config';

const HomeWrap = (props: any) => <Home appModel={appModel} {...props} />;

const { AttrPageFromRoute } = AttrPage;

const routes = [
  [`/survey`, StartNewSurvey.with(survey), true],
  [`/survey/:smpId`, HomeWrap],
  [`/survey/:smpId/:attr`, AttrPageFromRoute],
  [`/survey/:smpId/:occId/:attr`, AttrPageFromRoute],
  [`/survey/:smpId/:occId/number`, NumberAttr],
  [`/survey/:smpId/location`, ModelLocation],
  [`/survey/:smpId/species`, Species],
];

export default RouteWithModels.fromArray(samples as any, routes);
