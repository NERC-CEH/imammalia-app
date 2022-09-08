import { Route } from 'react-router-dom';
import appModel from 'models/app';
import Menu from './Menu';
import Language from './Language';
import Country from './Country';

const CountryWrap = () => <Country appModel={appModel} />;
const LanguageWrap = () => <Language appModel={appModel} />;

export default [
  <Route path="/settings/menu" key="/settings/menu" exact component={Menu} />,
  <Route
    path="/settings/language"
    key="/settings/language"
    exact
    render={LanguageWrap}
  />,
  <Route
    path="/settings/country"
    key="/settings/country"
    exact
    render={CountryWrap}
  />,
];
