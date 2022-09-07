import { FC } from 'react';
import { observer } from 'mobx-react';
import { AppModel } from 'models/app';
import SelectLanguage from '../../Settings/Language';
import SelectCountry from '../../Settings/Country';

type Props = {
  appModel: AppModel;
  children: any;
};

const LanguageCountrySelectRequired: FC<Props> = ({ appModel, children }) => {
  if (!appModel.attrs.language) {
    return <SelectLanguage appModel={appModel} hideHeader />;
  }

  if (!appModel.attrs.country) {
    return <SelectCountry appModel={appModel} hideHeader />;
  }

  return children;
};

export default observer(LanguageCountrySelectRequired);
