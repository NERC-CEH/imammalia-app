import { observer } from 'mobx-react';
import {
  settingsOutline,
  exitOutline,
  personOutline,
  personAddOutline,
  lockClosedOutline,
  heartOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { InfoMessage } from '@flumens';
import { IonContent, IonIcon, IonList, IonItem, IonButton } from '@ionic/react';
import config from 'common/config';
import { AppModel } from 'models/app';
import { UserModel } from 'models/user';
import './logo.png?originalName';
import './styles.scss';

type Props = {
  logOut: any;
  isLoggedIn: boolean;
  userModel: UserModel;
  appModel: AppModel;
  refreshAccount: any;
  resendVerificationEmail: any;
};

const Component = ({
  isLoggedIn,
  userModel,
  logOut,
  appModel,
  refreshAccount,
  resendVerificationEmail,
}: Props) => {
  const lang = appModel.data.language;

  const isNotVerified = userModel.data.verified === false; // verified is undefined in old versions
  const userEmail = userModel.data.email;

  return (
    <IonContent className="app-menu">
      <img src="/images/logo.png" alt="app logo" />

      <IonList lines="full">
        <div className="rounded-list">
          {isLoggedIn && (
            <IonItem detail id="logout-button" onClick={logOut}>
              <IonIcon icon={exitOutline} size="small" slot="start" />
              <T>Logout</T>
              {': '}
              {userModel.data.firstName} {userModel.data.lastName}
            </IonItem>
          )}

          {isLoggedIn && isNotVerified && (
            <InfoMessage className="verification-warning">
              Looks like your <b>{{ userEmail } as any}</b> email hasn't been
              verified yet.
              <div>
                <IonButton fill="outline" onClick={refreshAccount}>
                  Refresh
                </IonButton>
                <IonButton fill="clear" onClick={resendVerificationEmail}>
                  Resend Email
                </IonButton>
              </div>
            </InfoMessage>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/login" detail>
              <IonIcon icon={personOutline} size="small" slot="start" />
              <T>Login</T>
            </IonItem>
          )}

          {!isLoggedIn && (
            <IonItem routerLink="/user/register" detail>
              <IonIcon icon={personAddOutline} size="small" slot="start" />
              <T>Register</T>
            </IonItem>
          )}
        </div>

        <h3 className="list-title">
          <T>Info</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/info/about" detail>
            <IonIcon
              icon={informationCircleOutline}
              size="small"
              slot="start"
            />
            <T>About</T>
          </IonItem>

          <IonItem routerLink="/info/credits" detail>
            <IonIcon icon={heartOutline} size="small" slot="start" />
            <T>Credits</T>
          </IonItem>

          <IonItem
            href={`${config.backend.url}/privacy-notice?lang=${lang}`}
            target="_blank"
            detail
          >
            <IonIcon icon={lockClosedOutline} size="small" slot="start" />
            <T>Privacy Policy</T>
          </IonItem>
        </div>

        <h3 className="list-title">
          <T>Settings</T>
        </h3>
        <div className="rounded-list">
          <IonItem routerLink="/settings/menu" detail>
            <IonIcon icon={settingsOutline} size="small" slot="start" />
            <T>App</T>
          </IonItem>
        </div>
      </IonList>
    </IonContent>
  );
};

export default observer(Component);
