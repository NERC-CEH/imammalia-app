/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { observer } from 'mobx-react';
import { arrowForward, checkmarkOutline } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button, Main, Page } from '@flumens';
import { IonButtons, IonFooter, IonIcon, IonToolbar } from '@ionic/react';
import '@ionic/react/css/ionic-swiper.css';
import appModel from 'models/app';
import welcomeOne from './images/welcome_1.jpg';
import welcomeTwo from './images/welcome_2.jpg';

const Onboarding = ({ children }: any) => {
  const [moreSlidesExist, setMoreSlidesExist] = useState(true);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperCore>();

  const handleSlideChangeStart = async () => {
    const isEnd = controlledSwiper && controlledSwiper.isEnd;
    setMoreSlidesExist(!isEnd);
  };

  const { showedWelcome } = appModel.data;

  if (showedWelcome) return children;

  function exit() {
    console.log('Info:Welcome:Controller: exit.');
    appModel.data.showedWelcome = true;
    appModel.save();
  }

  const slideNextOrClose = () => {
    if (moreSlidesExist) {
      controlledSwiper && controlledSwiper.slideNext();
      return;
    }

    exit();
  };

  return (
    <Page id="welcome-page">
      <Main>
        <Swiper
          id="welcome"
          className="fixed left-0 top-0 h-screen w-screen bg-white [--bullet-background-active:white]"
          onSwiper={setControlledSwiper}
          modules={[Pagination]}
          pagination={moreSlidesExist}
          onSlideChange={handleSlideChangeStart}
        >
          <SwiperSlide
            className="bg-cover bg-left bg-no-repeat relative"
            style={{ backgroundImage: `url(${welcomeOne})` }}
          >
            <div className="absolute top-[calc(env(safe-area-inset-top)+2%)] w-3/4 text-base rounded-md border border-solid border-white/60 bg-white/70 px-6 py-3 text-left font-light text-primary-900 backdrop-blur-sm backdrop-filter">
              <T>
                The iMammalia App is designed to encourage recording of mammals
                in the wild. This version of the mobile application is set up to
                easily record mammals in any European country, but does not yet
                have all European languages included.
              </T>
            </div>
          </SwiperSlide>

          <SwiperSlide
            className="bg-cover bg-left bg-no-repeat relative"
            style={{ backgroundImage: `url(${welcomeTwo})` }}
          >
            <div className="absolute top-[calc(env(safe-area-inset-top)+2%)] w-3/4 text-base rounded-md border border-solid border-white/60 bg-white/70 px-6 py-3 text-left font-light text-primary-900 backdrop-blur-sm backdrop-filter">
              <T>
                Sightings can be recorded anywhere, with or without photos, and
                all records will be verified by experts and made available to
                help with mapping the distribution of European mammals. You can
                check and update your records online.
              </T>
            </div>
          </SwiperSlide>
        </Swiper>
      </Main>

      <IonFooter className="ion-no-border">
        <IonToolbar className="absolute bottom-0 [--background:transparent] [--border-color:transparent]">
          <IonButtons slot="end">
            <Button
              className="mb-3 mr-2 size-12 rounded-full p-0 shadow-lg"
              color="secondary"
              onPress={slideNextOrClose}
            >
              <IonIcon
                icon={!moreSlidesExist ? checkmarkOutline : arrowForward}
                className="size-6"
              />
            </Button>
          </IonButtons>
        </IonToolbar>
      </IonFooter>
    </Page>
  );
};

export default observer(Onboarding);
