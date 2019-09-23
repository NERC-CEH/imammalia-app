import React from 'react';
import PropTypes from 'prop-types';
import { IonContent, IonList, IonItem, IonModal } from '@ionic/react';
import ModalHeader from 'common/Components/ModalHeader';
import './images';
import species from './species.data.json';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

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

  getSpecies = () => {
    const { appModel, onSpeciesClick } = this.props;
    const country = appModel.get('country');

    const filteredSpecies =
      country === 'ELSEWHERE' ? species : species.filter(sp => sp[country]);

    return filteredSpecies.map(sp => {
      const { id, english } = sp;

      const onClick = onSpeciesClick
        ? () => onSpeciesClick(sp)
        : () => this.showSpeciesModal(id);

      return (
        <IonItem key={id} className="species-list-item" onClick={onClick}>
          <div
            style={{
              backgroundImage: `url('/images/${id}.jpg')`,
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
      <IonContent id="home-species" class="ion-padding">
        <IonList lines="full">{this.getSpecies()}</IonList>
        <IonModal isOpen={this.state.showModal}>
          <ModalHeader title="Species" onClose={this.hideSpeciesModal} />
          {this.state.showModal && (
            <SpeciesProfile species={this.state.species} />
          )}
        </IonModal>
      </IonContent>
    );
  }
}

export default Component;
