import React from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import Toggle from 'common/Components/Toggle';
import {
  IonContent,
  IonIcon,
  IonList,
  IonItemDivider,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { undo, school, flame, flag, globe } from 'ionicons/icons';
import alert from 'common/helpers/alert';
import config from 'config';
import './styles.scss';

function resetDialog(resetApp) {
  alert({
    header: t('Reset'),
    message: `${t(
      'Are you sure you want to reset the application to its initial state?'
    )}<p><b>${t('This will wipe all the locally stored app data!')}</b></p>`,
    buttons: [
      {
        text: t('Cancel'),
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: t('Reset'),
        cssClass: 'secondary',
        handler: resetApp,
      },
    ],
  });
}

@observer
class Component extends React.Component {
  static propTypes = {
    resetApp: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
    useTraining: PropTypes.bool.isRequired,
    useExperiments: PropTypes.bool.isRequired,
    language: PropTypes.string,
    country: PropTypes.string,
  };

  render() {
    const {
      resetApp,
      onToggle,
      useTraining,
      useExperiments,
      language,
      country,
    } = this.props;

    return (
      <>
        <IonContent class="app-settings">
          <IonList lines="full">
            <IonItemDivider>{t('Application')}</IonItemDivider>
            <IonItem href="/settings/language">
              <IonLabel>{t('Language')}</IonLabel>
              <IonIcon icon={flag} size="small" slot="start" />
              <IonLabel slot="end">{language}</IonLabel>
            </IonItem>
            <IonItem href="/settings/country">
              <IonLabel>{t('Country')}</IonLabel>
              <IonIcon icon={globe} size="small" slot="start" />
              <IonLabel slot="end">{country}</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon icon={school} size="small" slot="start" />
              <IonLabel>{t('Training Mode')}</IonLabel>
              <Toggle
                onToggle={checked => onToggle('useTraining', checked)}
                checked={useTraining}
              />
            </IonItem>
            <IonItem id="app-reset-btn" onClick={() => resetDialog(resetApp)}>
              <IonIcon icon={undo} size="small" slot="start" />
              {t('Reset')}
            </IonItem>
            <IonItem>
              <IonIcon icon={flame} size="small" slot="start" />
              <IonLabel>{t('Experimental Features')}</IonLabel>
              <Toggle
                onToggle={checked => onToggle('useExperiments', checked)}
                checked={useExperiments}
              />
            </IonItem>
          </IonList>

          <p className="app-version">
            {`v${config.version} (${config.build})`}
          </p>
        </IonContent>
      </>
    );
  }
}

export default Component;
