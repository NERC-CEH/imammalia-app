import { FC, useState } from 'react';
import { observer } from 'mobx-react';
import appModel from 'models/app';
import { IonButton } from '@ionic/react';
import { Trans as T } from 'react-i18next';
import { Page, Main } from '@flumens';
import SwiperCore, { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '@ionic/react/css/ionic-swiper.css';
import backgroundImage1 from './images/welcome_1.jpg';
import backgroundImage2 from './images/welcome_2.jpg';
import './styles.scss';

type Props = {};

const OnBoardingScreens: FC<Props> = ({ children }) => {
  const [moreSlidesExist, setMoreSlidesExist] = useState(true);
  const [controlledSwiper, setControlledSwiper] = useState<SwiperCore>();

  const handleSlideChangeStart = async () => {
    const isEnd = controlledSwiper && controlledSwiper.isEnd;
    setMoreSlidesExist(!isEnd);
  };

  const slideNextOrClose = () => {
    if (moreSlidesExist) {
      controlledSwiper && controlledSwiper.slideNext();
      return;
    }

    exit();
  };

  function exit() {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.showedWelcome = true;
    appModel.save();
  }

  const { showedWelcome } = appModel.attrs;
  if (showedWelcome) {
    return <>{children}</>; // eslint-disable-line react/jsx-no-useless-fragment
  }

  return (
    <Page id="welcome">
      <Main>
        <Swiper
          onSwiper={setControlledSwiper}
          modules={[Pagination]}
          pagination={moreSlidesExist}
          onSlideChange={handleSlideChangeStart}
        >
          <SwiperSlide
            className="first"
            style={{ backgroundImage: `url(${backgroundImage1})` }}
          >
            <IonButton class="skip" color="primary" onClick={exit}>
              <T>Skip</T>
            </IonButton>
            <IonButton class="next" color="primary" onClick={slideNextOrClose}>
              <T>Next</T>
            </IonButton>
            <div className="message">
              <p>
                <T>
                  The iMammalia App is designed to encourage recording of
                  mammals in the wild. This version of the mobile application is
                  set up to easily record mammals in any European country, but
                  does not yet have all European languages included.
                </T>
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide
            className="fourth"
            style={{ backgroundImage: `url(${backgroundImage2})` }}
          >
            <div className="message">
              <p>
                <T>
                  Sightings can be recorded anywhere, with or without photos,
                  and all records will be verified by experts and made available
                  to help with mapping the distribution of European mammals. You
                  can check and update your records online.
                </T>
              </p>
            </div>
            <IonButton color="primary" onClick={exit}>
              <T>Get Started</T>
            </IonButton>
          </SwiperSlide>
        </Swiper>
      </Main>
    </Page>
  );
};

export default observer(OnBoardingScreens);
