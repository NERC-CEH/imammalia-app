import React from 'react';
import PropTypes from 'prop-types';
import { IonButton } from '@ionic/react';
import AppHeader from 'Components/Header';
import './styles.scss';

function getFinishButton(onSubmit) {
  return <IonButton onClick={onSubmit}>{t('Finish')}</IonButton>;
}

const Header = ({ onSubmit, isTraining }) => {
  const trainingModeSubheader = isTraining && (
    <div className="training-record">{t('Training Mode')}</div>
  );

  return (
    <AppHeader
      title={t('Record')}
      rightSlot={getFinishButton(onSubmit)}
      subheader={trainingModeSubheader}
    />
  );
};

Header.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isTraining: PropTypes.bool.isRequired,
};

export default Header;
