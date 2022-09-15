import { FC } from 'react';
import { observer } from 'mobx-react';
import {
  IonContent,
  IonIcon,
  IonList,
  IonItem,
  IonItemDivider,
} from '@ionic/react';
import {
  settingsOutline,
  exit,
  personOutline,
  personAddOutline,
  lockClosedOutline,
  heartOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import config from 'common/config';
import { UserModel } from 'models/user';
import { AppModel } from 'models/app';
import './styles.scss';
import './logo.png?originalName';

type Props = {
  logOut: any;
  isLoggedIn: boolean;
  userModel: UserModel;
  appModel: AppModel;
};

const Component: FC<Props> = ({ isLoggedIn, userModel, logOut, appModel }) => {
  const lang = appModel.attrs.language;

  return (
    <IonContent class="app-menu">
      <img src="/images/logo.png" alt="app logo" />

      <IonList lines="full">
        <div className="rounded">
          {isLoggedIn && (
            <IonItem detail id="logout-button" onClick={logOut}>
              <IonIcon icon={exit} size="small" slot="start" />
              <T>Logout</T>
              {': '}
              {userModel.attrs.firstname} {userModel.attrs.secondname}
            </IonItem>
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

        <IonItemDivider>
          <T>Info</T>
        </IonItemDivider>
        <div className="rounded">
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

        <IonItemDivider>
          <T>Settings</T>
        </IonItemDivider>
        <div className="rounded">
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
