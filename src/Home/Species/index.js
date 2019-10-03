import React from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {
  IonContent,
  IonList,
  IonItem,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
} from '@ionic/react';
import ModalHeader from 'common/Components/ModalHeader';
import { funnel } from 'ionicons/icons';
import alert from 'common/helpers/alert';
import './images';
import './thumbnails';
import './maps';
import species from './species.data.json';
import speciesGroups from './species.groups.data.json';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

function showFiltersDialog(appModel) {
  const currentValue = toJS(appModel.get('speciesFilter'));

  const sizes = {
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

  const inputs = Object.keys(sizes).map(size => ({
    name: 'size',
    type: 'checkbox',
    label: sizes[size],
    value: size,
    checked: currentValue.includes(size),
  }));

  alert({
    header: t('Filter species size'),
    inputs,

    buttons: [
      {
        text: t('Cancel'),
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: t('OK'),
        cssClass: 'primary',
        handler: speciesFilter => {
          appModel.set('speciesFilter', speciesFilter);
          appModel.save();
        },
      },
    ],
  });
}

@observer
class Component extends React.Component {
  static propTypes = {
    appModel: PropTypes.object.isRequired,
    onSpeciesClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { showModal: false, species: null };
  }

  showSpeciesModal = id => {
    this.setState({ showModal: true, species: species[id - 1] });
  };

  hideSpeciesModal = () => {
    this.setState({ showModal: false });
  };

  getFiltersHeader = () => {
    const { onSpeciesClick, appModel } = this.props;

    const isRecordingMode = !!onSpeciesClick;

    if (isRecordingMode) {
      return null;
    }

    return (
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton onClick={() => showFiltersDialog(appModel)}>
              <IonIcon icon={funnel} role="img" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
    );
  };

  getSpecies = () => {
    const { appModel, onSpeciesClick } = this.props;
    const country = appModel.get('country');

    const isRecordingMode = !!onSpeciesClick;
    const allSpecies = isRecordingMode
      ? [...species, ...speciesGroups]
      : species;

    const speciesFilter = appModel.get('speciesFilter');
    const filteredSpecies = allSpecies
      .filter(sp => country === 'ELSEWHERE' || sp[country] || sp.group)
      .filter(sp =>
        speciesFilter.length ? speciesFilter.find(filter => sp[filter]) : true
      )
      .sort((sp1, sp2) => sp1.sort_id - sp2.sort_id);

    return filteredSpecies.map(sp => {
      const { id, english, group } = sp;

      const onClick = onSpeciesClick
        ? () => onSpeciesClick(sp)
        : () => this.showSpeciesModal(id);

      if (group) {
        return (
          <IonItem
            key={id}
            className={`species-list-item ${group ? 'group' : ''}`}
            onClick={onClick}
          >
            <span className="label">
              {`${t(english)} ${group ? t('(unknown species)') : ''}`}
            </span>
          </IonItem>
        );
      }

      return (
        <IonItem key={id} className="species-list-item" onClick={onClick}>
          <div
            style={{
              backgroundImage: `url('/images/${id}_thumbnail.jpg')`,
            }}
          >
            <span className="label">{t(english)}</span>
          </div>
        </IonItem>
      );
    });
  };

  render() {
    return (
      <>
        {this.getFiltersHeader()}

        <IonContent id="home-species" class="ion-padding">
          <IonList lines="full">{this.getSpecies()}</IonList>
          <IonModal isOpen={this.state.showModal}>
            <ModalHeader title="Species" onClose={this.hideSpeciesModal} />
            {this.state.showModal && (
              <SpeciesProfile species={this.state.species} />
            )}
          </IonModal>
        </IonContent>
      </>
    );
  }
}

export default Component;
