import React from 'react';
import { observer } from 'mobx-react';
import { IonSlides, IonSlide, IonButton } from '@ionic/react';
import Log from 'helpers/log';
import appModel from 'app_model';
import './styles.scss';
import './images/welcome_1.jpg';
import './images/welcome_2.jpg';
import './images/welcome_3.jpg';
import './images/welcome_4.jpg';

function next(sliderRef) {
  sliderRef.current.slideNext();
}

const SplashScreen = () => {
  function exit() {
    Log('Info:Welcome:Controller: exit.');
    appModel.set('showedWelcome', true);
    appModel.save();
  }

  const sliderRef = React.createRef();

  return (
    <IonSlides id="welcome" pager="true" ref={sliderRef}>
      <IonSlide class="first">
        <IonButton class="skip" color="primary" strong="true" onClick={exit}>
          {t('Skip')}
        </IonButton>
        <IonButton
          class="next"
          color="primary"
          strong="true"
          onClick={() => next(sliderRef)}
        >
          {t('Next')}
        </IonButton>
        <div className="message">
          <p>{t(`SOME INTRO TEXT`)}</p>
        </div>
      </IonSlide>
      <IonSlide class="fourth">
        <div className="message">
          <p>{t(`SOME INTRO TEXT`)}</p>
        </div>
        <IonButton color="primary" strong="true" onClick={exit}>
          {t('Get Started')}
        </IonButton>
      </IonSlide>
    </IonSlides>
  );
};

SplashScreen.propTypes = {};

const Component = observer(props => {
  if (!appModel.get('showedWelcome')) {
    return <SplashScreen appModel={appModel} />;
  }

  return props.children;
});

Component.propTypes = {};

export default Component;
