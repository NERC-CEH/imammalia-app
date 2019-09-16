import React from 'react';
import { Route } from 'react-router-dom';
import appModel from 'app_model';
import userModel from 'user_model';
import Menu from './Menu';
import Language from './Language';
import Country from './Country';

export default function Settings() {
  return (
    <>
      <Route
        path="/settings/menu"
        exact
        render={() => <Menu appModel={appModel} userModel={userModel} />}
      />
      <Route
        path="/settings/language"
        exact
        render={() => <Language appModel={appModel} />}
      />
      <Route
        path="/settings/country"
        exact
        render={() => <Country appModel={appModel} />}
      />
    </>
  );
}
