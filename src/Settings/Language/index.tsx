import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import { AppModel } from 'models/app';
import { Page, Header, Main } from '@flumens';
import {
  IonIcon,
  IonList,
  IonItem,
  IonRadioGroup,
  IonRadio,
  IonLabel,
  NavContext,
} from '@ionic/react';
import { globe } from 'ionicons/icons';
import languages from 'helpers/languages';
import './styles.scss';

type Props = {
  appModel: AppModel;
  hideHeader?: boolean;
};

const SelectLanguage: FC<Props> = ({ appModel, hideHeader }) => {
  const currentValue = appModel.attrs.language;
  const { goBack } = useContext(NavContext);

  function onSelect(e: any) {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.language = e.target.value;
    appModel.save();
    goBack();
  }

  const languageExists = ([, lang]: any) => !!lang;
  const alphabetically = (l1: any, l2: any) => l1[1].localeCompare(l2[1]);
  const languagesOptions = Object.entries(languages)
    .filter(languageExists)
    .sort(alphabetically)
    .map(([value, language]) => (
      <IonItem key={value}>
        <IonLabel>{language}</IonLabel>
        <IonRadio value={value} defaultChecked={currentValue === value} />
      </IonItem>
    ));

  return (
    <Page id="language-select">
      {!hideHeader && <Header title="Language" />}

      <Main>
        <IonList>
          {hideHeader && (
            <div className="header">
              <IonIcon icon={globe} size="large" />
              <h4>Select your language</h4>
            </div>
          )}
          <IonRadioGroup onIonChange={onSelect} value={currentValue}>
            {languagesOptions}
          </IonRadioGroup>
        </IonList>
      </Main>
    </Page>
  );
};

export default observer(SelectLanguage);
