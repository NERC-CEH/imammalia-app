import { FC } from 'react';
import { Page, useAlert } from '@flumens';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { UserModel } from 'models/user';
import { AppModel } from 'models/app';
import Main from './Main';

function showLogoutConfirmationDialog(callback: any, alert: any) {
  alert({
    header: 'Logout',
    message: (
      <>
        <T>Are you sure you want to logout?</T>
        <br />
        <br />

        <T>
          Your pending and uploaded <b>records will not be deleted </b> from
          this device.
        </T>
      </>
    ),
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Logout',
        cssClass: 'primary',
        handler: callback,
        role: 'destructive',
      },
    ],
  });
}

type Props = {
  userModel: UserModel;
  appModel: AppModel;
};
const MenuController: FC<Props> = ({ userModel, appModel }) => {
  const alert = useAlert();

  const isLoggedIn = userModel.isLoggedIn();

  function logOut() {
    console.log('Info:Menu: logging out.');
    const onReset = () => {
      // eslint-disable-next-line no-param-reassign
      appModel.attrs.recordDraftId = null;
      appModel.save();
      userModel.logOut();
    };

    showLogoutConfirmationDialog(onReset, alert);
  }

  return (
    <Page id="menu">
      <Main
        userModel={userModel}
        appModel={appModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
      />
    </Page>
  );
};

export default observer(MenuController);
