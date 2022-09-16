import { useContext } from 'react';
import appModel, { Attrs as AppModelAttrs } from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import { Page, Header, PickByType, useToast, useLoader } from '@flumens';
import { isPlatform, NavContext } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import Main from './Main';

const useResetApp = () => {
  const toast = useToast();

  const reset = async () => {
    console.log('Settings:Menu:Controller: resetting the application!');

    try {
      await savedSamples.resetDefaults();
      await appModel.resetDefaults();
      await userModel.resetDefaults();
      toast.success('Done');
    } catch (err: any) {
      toast.error(err);
    }
  };

  return reset;
};

const useDeleteUser = () => {
  const toast = useToast();
  const loader = useLoader();
  const { goBack } = useContext(NavContext);

  const deleteUser = async () => {
    console.log('Settings:Menu:Controller: deleting the user!');

    await loader.show('Please wait...');

    try {
      await userModel.delete();
      goBack();
      toast.success('Done');
    } catch (err: any) {
      toast.error(err);
    }

    loader.hide();
  };

  return deleteUser;
};

function onToggle(
  setting: keyof PickByType<AppModelAttrs, boolean>,
  checked: boolean
) {
  if (setting === 'useExperiments' && !checked) {
    appModel.attrs.useExperiments = false;
    appModel.save();
    return;
  }

  appModel.attrs[setting] = checked;
  appModel.save();

  isPlatform('hybrid') && Haptics.impact({ style: ImpactStyle.Light });
}

const MenuController = () => {
  const deleteUser = useDeleteUser();
  const resetApp = useResetApp();

  const resetApplication = () => resetApp();

  const { useTraining, sendAnalytics, language, country } = appModel.attrs;

  return (
    <Page id="settings">
      <Header title="Settings" />
      <Main
        useTraining={useTraining}
        sendAnalytics={sendAnalytics}
        resetApp={resetApplication}
        onToggle={onToggle}
        language={language}
        country={country}
        isLoggedIn={userModel.isLoggedIn()}
        deleteUser={deleteUser}
      />
    </Page>
  );
};

export default MenuController;
