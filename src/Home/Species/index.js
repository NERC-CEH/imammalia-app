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
  };

  constructor(props) {
    super(props);
    this.state = { showModal: false, species: null };
  }

  showSpeciesModal = id => {
    this.setState({ showModal: true, species: species[id] });
  };

  hideSpeciesModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    const { appModel } = this.props;
    const country = appModel.get('country');

    const filteredSpecies = species.filter(sp => sp[country]);

    return (
      <IonContent id="home-species" class="ion-padding">
        <IonList lines="full">
          {filteredSpecies.map((_, id) => (
            <IonItem
              key={filteredSpecies[id].id}
              className="species-list-item"
              onClick={() => this.showSpeciesModal(id)}
            >
              <div
                style={{
                  backgroundImage: `url('/images/${filteredSpecies[id].id + 1}.jpg')`,
                }}
              >
                <span className="label">{filteredSpecies[id].english}</span>
              </div>
            </IonItem>
          ))}
        </IonList>
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
