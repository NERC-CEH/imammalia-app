import { Route } from 'react-router-dom';
import userModel from 'models/user';
import appModel from 'models/app';
import About from './About';
import Menu from './Menu';
import Credits from './Credits';

const MenuWrap = () => <Menu userModel={userModel} appModel={appModel} />;

export default [
  <Route path="/info/menu" key="/info/menu" exact component={MenuWrap} />,
  <Route path="/info/about" key="/info/about" exact component={About} />,
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
];
