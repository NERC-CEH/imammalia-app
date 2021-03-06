import React from 'react';
import PropTypes from 'prop-types';
import Log from 'helpers/log';
import Device from 'helpers/device';
import { IonPage } from '@ionic/react';
import alert from 'common/helpers/alert';
import loader from 'common/helpers/loader';
import AppHeader from 'Components/Header';
import Main from './Main';

async function onRegister(userModel, details, lang) {
  const { email, password, firstname, secondname } = details;
  if (!Device.isOnline()) {
    alert({
      header: t('Offline'),
      message: t("Sorry, looks like you're offline."),
      buttons: [t('OK')],
    });
    return;
  }
  await loader.show({
    message: t('Please wait...'),
  });

  const registrationDetails = {
    type: 'users',
    email: email.trim(),
    firstname: firstname.trim(),
    secondname: secondname.trim(),
    password,
    passwordConfirm: password,
    termsAgree: true,
    lang,
  };

  try {
    await userModel.register(registrationDetails);
    alert({
      header: t('Welcome aboard!'),
      message: t(
        'Before submitting any records please check your email and click on the verification link.'
      ),
      buttons: [
        {
          text: t('OK, got it'),
          role: 'cancel',
          handler() {
            window.history.back();
          },
        },
      ],
    });
  } catch (err) {
    Log(err, 'e');
    alert({
      header: t('Sorry'),
      message: err.message,
      buttons: [t('OK')],
    });
  }

  loader.hide();
}

export default function RegisterContainer({ userModel, appModel }) {
  const lang = appModel.get('language');

  return (
    <IonPage>
      <AppHeader title={t('Register')} />
      <Main
        schema={userModel.registerSchema}
        onSubmit={details => onRegister(userModel, details, lang)}
        lang={lang}
      />
    </IonPage>
  );
}

RegisterContainer.propTypes = {
  userModel: PropTypes.object.isRequired,
  appModel: PropTypes.object.isRequired,
};
