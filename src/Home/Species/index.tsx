import { FC } from 'react';
import { toJS } from 'mobx';
import { Page, useAlert } from '@flumens';
import { AppModel } from 'models/app';
import SavedSamples from 'models/savedSamples';
import { UserModel } from 'models/user';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import {
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { funnel } from 'ionicons/icons';
import SpeciesList from 'common/Components/SpeciesList';

function showFiltersDialog(appModel: AppModel, alert: any, t: any) {
  const currentValue = toJS(appModel.attrs.speciesFilter);

  const sizes: any = {
    // xxxs doesn't exist yet
    // xxxs: t('Mice or smaller'),
    xxs: t('Mouse-rat'),
    xs: t('Hedgehog-squirrel'),
    s: t('Rabbit-hare'),
    m: t('Cats-medium size canivorous'),
    l: t('Dog-Wildboar'),
    xl: t('Goat-Deers'),
    xxl: t('Cow-Bison'),
  };

  const checkboxes = Object.keys(sizes).map(size => ({
    name: 'size',
    type: 'checkbox',
    label: sizes[size] as any,
    value: size,
    checked: currentValue.includes(size),
  }));

  alert({
    header: 'Filter species size',
    inputs: checkboxes,

    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'OK',
        cssClass: 'primary',
        handler: (speciesFilter: any) => {
          // eslint-disable-next-line no-param-reassign
          appModel.attrs.speciesFilter = speciesFilter;
          appModel.save();
        },
      },
    ],
  });
}

type Props = {
  appModel: AppModel;
  savedSamples: typeof SavedSamples;
  userModel: UserModel;
};

const SpeciesController: FC<Props> = ({
  appModel,
  savedSamples,
  userModel,
}) => {
  const alert = useAlert();
  const { t } = useTranslation();

  const color =
    appModel.attrs?.speciesFilter?.length > 0 ? 'secondary' : 'light';
  return (
    <Page id="home-species">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => showFiltersDialog(appModel, alert, t)}>
              <IonIcon color={color} icon={funnel} role="img" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <SpeciesList
        appModel={appModel}
        savedSamples={savedSamples}
        userModel={userModel}
      />
    </Page>
  );
};

export default observer(SpeciesController);
