import { FC, useContext } from 'react';
import userModel from 'models/user';
import { NavContext } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useToast, useLoader, Page, Header, device } from '@flumens';
import Main from './Main';
import './styles.scss';

export type Details = {
  password: string;
  email: string;
};

const LoginController: FC = () => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();
  const { t } = useTranslation();

  const onSuccessReturn = () => {
    const { email } = userModel.attrs;
    toast.success(t('Successfully logged in as: {{email}}', { email }), {
      skipTranslation: true,
    });

    navigate('/home/user-records', 'root');
  };

  async function onLogin(details: Details) {
    const { email, password } = details;

    if (!device.isOnline) {
      toast.warn("Sorry, looks like you're offline.");
      return;
    }

    await loader.show('Please wait...');

    try {
      await userModel.logIn(email.trim(), password);

      onSuccessReturn();
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  }

  return (
    <Page id="user-login">
      <Header className="ion-no-border" />
      <Main schema={userModel.loginSchema} onSubmit={onLogin} />
    </Page>
  );
};

export default LoginController;
