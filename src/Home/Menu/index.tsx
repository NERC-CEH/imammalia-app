import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { Page, useAlert, useLoader, useToast, device } from '@flumens';
import { AppModel } from 'models/app';
import { UserModel } from 'models/user';
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
const MenuController = ({ userModel, appModel }: Props) => {
  const alert = useAlert();
  const loader = useLoader();
  const toast = useToast();

  const isLoggedIn = userModel.isLoggedIn();

  function logOut() {
    console.log('Info:Menu: logging out.');
    const onReset = () => {
      // eslint-disable-next-line no-param-reassign
      appModel.data.recordDraftId = null;
      appModel.save();
      userModel.logOut();
    };

    showLogoutConfirmationDialog(onReset, alert);
  }

  const checkActivation = async () => {
    await loader.show('Please wait...');
    try {
      await userModel.checkActivation();
      if (!userModel.data.verified) {
        toast.warn('The user has not been activated or is blocked.');
      }
    } catch (err: any) {
      toast.error(err);
    }
    loader.hide();
  };

  const resendVerificationEmail = async () => {
    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    await loader.show('Please wait...');
    try {
      await userModel.resendVerificationEmail();
      toast.success(
        'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.'
      );
    } catch (err: any) {
      toast.error(err);
    }
    loader.hide();
  };

  return (
    <Page id="menu">
      <Main
        userModel={userModel}
        appModel={appModel}
        isLoggedIn={isLoggedIn}
        logOut={logOut}
        refreshAccount={checkActivation}
        resendVerificationEmail={resendVerificationEmail}
      />
    </Page>
  );
};

export default observer(MenuController);
