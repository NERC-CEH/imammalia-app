import React from 'react';
import { observer } from 'mobx-react';
import AppHeader from 'common/Components/Header';
import './styles.scss';

const Header = observer(() => {
  return <AppHeader title={t('Location')} />;
});

Header.propTypes = {};

export default Header;
