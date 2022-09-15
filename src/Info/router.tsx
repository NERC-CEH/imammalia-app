import { Route } from 'react-router-dom';
import About from './About';
import Credits from './Credits';

export default [
  <Route path="/info/about" key="/info/about" exact component={About} />,
  <Route path="/info/credits" key="/info/credits" exact component={Credits} />,
];
