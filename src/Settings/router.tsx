import { Route } from 'react-router-dom';
import Country from './Country';
import Language from './Language';
import Menu from './Menu';

export default [
  <Route path="/settings/menu" key="/settings/menu" exact component={Menu} />,
  <Route
    path="/settings/language"
    key="/settings/language"
    exact
    component={Language}
  />,
  <Route
    path="/settings/country"
    key="/settings/country"
    exact
    component={Country}
  />,
];
