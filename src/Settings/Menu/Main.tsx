import { observer } from 'mobx-react';
import {
  warningOutline,
  schoolOutline,
  flagOutline,
  globeOutline,
  shareOutline,
  personRemoveOutline,
  cloudDownloadOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { Main, useAlert, InfoMessage, Toggle } from '@flumens';
import { IonIcon, IonList, IonItem, IonLabel, isPlatform } from '@ionic/react';
import config from 'common/config';
import countries, { CountryCode } from 'common/config/countries';
import languages, { LanguageCode } from 'common/config/languages';

function useDatabaseExportDialog(exportFn: any) {
  const alert = useAlert();

  const showDatabaseExportDialog = () => {
    alert({
      header: 'Export',
      message: (
        <T>
          Are you sure you want to export the data?
          <p className="my-2 font-bold">
            This feature is intended solely for technical support and is not a
            supported method for exporting your data
          </p>
        </T>
      ),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Export',
          handler: exportFn,
        },
      ],
    });
  };

  return showDatabaseExportDialog;
}

function useUserDeleteDialog(deleteUser: any) {
  const alert = useAlert();

  const showUserDeleteDialog = () => {
    alert({
      header: 'Account delete',
      message: (
        <T>
          Are you sure you want to delete your account?
          <InfoMessage
            color="danger"
            prefix={<IonIcon src={warningOutline} />}
            skipTranslation
          >
            This will remove your account on the{' '}
            <b>{{ url: config.backend.url } as any}</b> website. You will lose
            access to any records that you have previously submitted using the
            app or website.
          </InfoMessage>
        </T>
      ),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: deleteUser,
        },
      ],
    });
  };

  return showUserDeleteDialog;
}

type Props = {
  onToggle: any;
  useTraining: boolean;
  sendAnalytics: boolean;
  isLoggedIn: boolean;
  deleteUser: any;
  language: LanguageCode;
  country: CountryCode;
  exportDatabase: any;
  importDatabase: any;
};

const MenuMain = ({
  onToggle,
  isLoggedIn,
  deleteUser,
  useTraining,
  sendAnalytics,
  language,
  country,
  exportDatabase,
  importDatabase,
}: Props) => {
  const showDatabaseExportDialog = useDatabaseExportDialog(exportDatabase);

  const showUserDeleteDialog = useUserDeleteDialog(deleteUser);

  const onSendAnalyticsToggle = (checked: boolean) =>
    onToggle('sendAnalytics', checked);
  const onTrainingToggle = (checked: boolean) =>
    onToggle('useTraining', checked);

  const countryLabel = countries[country];
  const languageLabel = languages[language];

  return (
    <Main className="app-settings">
      <IonList lines="full">
        <h3 className="list-title">
          <T>Application</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/settings/language" detail>
            <IonLabel>
              <T>Language</T>
            </IonLabel>
            <IonIcon icon={flagOutline} size="small" slot="start" />
            <IonLabel slot="end">{languageLabel}</IonLabel>
          </IonItem>
          <IonItem routerLink="/settings/country" detail>
            <IonLabel>
              <T>Country</T>
            </IonLabel>
            <IonIcon icon={globeOutline} size="small" slot="start" />
            <IonLabel slot="end">
              <T>{countryLabel}</T>
            </IonLabel>
          </IonItem>
          <Toggle
            prefix={<IonIcon src={schoolOutline} className="size-6" />}
            label="Training Mode"
            defaultSelected={useTraining}
            onChange={onTrainingToggle}
          />
          <InfoMessage inline>
            Mark any new records as &#39;training&#39; and exclude from all
            reports.
          </InfoMessage>
          <Toggle
            prefix={<IonIcon src={shareOutline} className="size-6" />}
            label="Share App Analytics"
            defaultSelected={sendAnalytics}
            onChange={onSendAnalyticsToggle}
          />
          <InfoMessage inline>
            Share app crash data so we can make the app more reliable.
          </InfoMessage>

          <IonItem onClick={showDatabaseExportDialog}>
            <IonIcon icon={cloudDownloadOutline} size="small" slot="start" />
            <T>Export database</T>
          </IonItem>

          {!isPlatform('hybrid') && (
            <IonItem onClick={importDatabase}>
              <IonIcon icon={cloudUploadOutline} size="small" slot="start" />
              Import database
            </IonItem>
          )}
        </div>

        {isLoggedIn && (
          <h3 className="list-title">
            <T>Account</T>
          </h3>
        )}
        <div className="rounded-list">
          {isLoggedIn && (
            <>
              <IonItem onClick={showUserDeleteDialog} className="!text-danger">
                <IonIcon icon={personRemoveOutline} size="small" slot="start" />
                <IonLabel>
                  <T>Delete account</T>
                </IonLabel>
              </IonItem>
              <InfoMessage inline>
                You can delete your user account from the system.
              </InfoMessage>
            </>
          )}
        </div>
      </IonList>

      <p className="m-0 mx-auto w-full max-w-2xl p-2.5 text-right opacity-60">{`v${config.version} (${config.build})`}</p>
    </Main>
  );
};

export default observer(MenuMain);
