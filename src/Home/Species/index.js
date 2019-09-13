import React from 'react';
import { IonContent, IonList, IonItem, IonModal } from '@ionic/react';
import ModalHeader from 'common/Components/ModalHeader';
import './images';
import species from './species.data.json';
import SpeciesProfile from './components/SpeciesProfile';
import './styles.scss';

class Component extends React.Component {
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
    return (
      <IonContent
        id="home-species"
        class="ion-padding"
      >
        <IonList lines="full">
          {[...new Array(43)].map((_, id) => (
            <IonItem
              key={species[id].id}
              className="species-list-item"
              onClick={() => this.showSpeciesModal(id)}
            >
              <div
                style={{
                  backgroundImage: `url('/images/${id + 1}.jpg')`,
                }}
              >
                <span className="label">{species[id].english}</span>
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

// Component.propTypes = {};

export default Component;
