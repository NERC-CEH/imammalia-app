import React from 'react';
import PropTypes from 'prop-types';
import { IonButton } from '@ionic/react';
import AppHeader from 'common/Components/Header';
import './styles.scss';

function getFinishButton(onSubmit, isEditing) {
  const label = isEditing ? t('Upload') : t('Finish');
  return (
    <IonButton onClick={onSubmit}>
      {label}
    </IonButton>
  );
}

const Header = ({ onSubmit, isTraining, isEditing }) => {
  const trainingModeSubheader = isTraining && (
    <div className="training-record">training record</div>
  );

  return (
    <AppHeader
      title={t('Record')}
      rightSlot={getFinishButton(onSubmit, isEditing)}
      subheader={trainingModeSubheader}
    />
  );
};

Header.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isTraining: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool,
};

export default Header;
