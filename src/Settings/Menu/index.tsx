import appModel, { Attrs as AppModelAttrs } from 'models/app';
import userModel from 'models/user';
import savedSamples from 'models/savedSamples';
import { Page, Header, PickByType, useToast } from '@flumens';
import { isPlatform } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { observer } from 'mobx-react';
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
  const resetApp = useResetApp();

  const resetApplication = () => resetApp();

  const useTraining = appModel.attrs.useTraining;
  const sendAnalytics = appModel.attrs.sendAnalytics;
  const language = appModel.attrs.language;
  const country = appModel.attrs.country;

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
      />
    </Page>
  );
};

export default observer(MenuController);
