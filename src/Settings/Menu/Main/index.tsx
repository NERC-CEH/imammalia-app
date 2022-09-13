import { FC } from 'react';
import { Attrs as AppModelAttrs } from 'models/app';
import { observer } from 'mobx-react';
import {
  Main,
  useAlert,
  MenuAttrToggle,
  InfoMessage,
  PickByType,
} from '@flumens';
import {
  IonIcon,
  IonList,
  IonItemDivider,
  IonItem,
  IonLabel,
} from '@ionic/react';
import {
  arrowUndoOutline,
  warningOutline,
  schoolOutline,
  flagOutline,
  globeOutline,
  shareSocialOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import countries from 'helpers/countries';
import languages from 'helpers/languages';
import './styles.scss';

function resetDialog(resetApp: any, alert: any) {
  alert({
    header: 'Reset',
    message: (
      <>
        <T>
          Are you sure you want to reset the application to its initial state?
        </T>
        <InfoMessage
          color="danger"
          icon={warningOutline}
          className="destructive-warning"
        >
          This will wipe all the locally stored app data!
        </InfoMessage>
      </>
    ),
    buttons: [
      { text: 'Cancel', role: 'cancel', cssClass: 'secondary' },
      {
        text: 'Reset',
        role: 'destructive',
        handler: resetApp,
      },
    ],
  });
}

type Props = {
  resetApp: () => void;
  onToggle: (
    setting: keyof PickByType<AppModelAttrs, boolean>,
    checked: boolean
  ) => void;
  useTraining: boolean;
  sendAnalytics: boolean;
  language: string;
  country: string;
};
const MenuMain: FC<Props> = ({
  resetApp,
  onToggle,
  useTraining,
  sendAnalytics,
  language,
  country,
}) => {
  const alert = useAlert();
  const showResetDialog = () => resetDialog(resetApp, alert);

  const onSendAnalyticsToggle = (checked: boolean) =>
    onToggle('sendAnalytics', checked);

  const onTrainingToggle = (checked: boolean) =>
    onToggle('useTraining', checked);

  return (
    <Main>
      <IonList lines="full">
        <IonItemDivider>
          <T>Application</T>
        </IonItemDivider>
        <div className="rounded">
          <IonItem routerLink="/settings/language" detail>
            <IonLabel>
              <T>Language</T>
            </IonLabel>
            <IonIcon icon={flagOutline} size="small" slot="start" />
            <IonLabel slot="end">{(languages as any)[language]}</IonLabel>
          </IonItem>

          <IonItem routerLink="/settings/country" detail>
            <IonLabel>
              <T>Country</T>
            </IonLabel>
            <IonIcon icon={globeOutline} size="small" slot="start" />
            <IonLabel slot="end">
              <T>{(countries as any)[country]}</T>
            </IonLabel>
          </IonItem>

          <MenuAttrToggle
            icon={schoolOutline}
            label="Training Mode"
            value={useTraining}
            onChange={onTrainingToggle}
          />
          <InfoMessage color="medium">
            Mark any new records as 'training' and exclude from all reports.
          </InfoMessage>

          <MenuAttrToggle
            icon={shareSocialOutline}
            label="Share App Analytics"
            value={sendAnalytics}
            onChange={onSendAnalyticsToggle}
          />
          <InfoMessage color="medium">
            Share app crash data so we can make the app more reliable.
          </InfoMessage>
        </div>

        <div className="rounded destructive-item">
          <IonItem onClick={showResetDialog}>
            <IonIcon icon={arrowUndoOutline} size="small" slot="start" />
            <IonLabel>
              <T>Reset</T>
            </IonLabel>
          </IonItem>
          <InfoMessage color="medium">
            You can reset the app data to its default settings.
          </InfoMessage>
        </div>
      </IonList>
    </Main>
  );
};

export default observer(MenuMain);
