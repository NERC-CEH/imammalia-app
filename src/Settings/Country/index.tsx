import { FC, Fragment, useContext } from 'react';
import { Page, Header, Main } from '@flumens';
import { AppModel } from 'models/app';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import {
  IonIcon,
  IonList,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  IonItemDivider,
  NavContext,
} from '@ionic/react';
import { flag } from 'ionicons/icons';
import countries from 'helpers/countries';
import './styles.scss';

type Props = {
  appModel: AppModel;
  hideHeader?: boolean;
  /**
   *  Bug: (onBoarding page) page not re-rendering, possibly race condition.
   */
  t?: any;
};

const SelectCountry: FC<Props> = ({ appModel, hideHeader, t: tProp }) => {
  let { t } = useTranslation();

  t = tProp || t;

  const { goBack } = useContext(NavContext);
  const currentValue = appModel.attrs.country;

  const isSettingsPage = !hideHeader;

  function onSelect(e: any) {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.country = e.target.value;
    appModel.save();

    if (isSettingsPage) goBack();
  }

  const countriesOptions = Object.entries(countries).map(([value, country]) => (
    <Fragment key={value}>
      {value === 'ELSEWHERE' && <IonItemDivider key="test" />}
      <IonItem key={value}>
        <IonLabel>{t(country)}</IonLabel>
        <IonRadio value={value} defaultChecked={currentValue === value} />
      </IonItem>
    </Fragment>
  ));

  return (
    <Page id="country-select">
      {!hideHeader && <Header title="Country" />}

      <Main>
        <IonList>
          {hideHeader && (
            <div className="header">
              <IonIcon icon={flag} size="large" />
              <h4>{t('Select your country')}</h4>
            </div>
          )}
          <IonRadioGroup onIonChange={onSelect} value={currentValue}>
            {countriesOptions}
          </IonRadioGroup>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(SelectCountry);
