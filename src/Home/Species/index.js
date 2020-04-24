import React from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import {
  IonContent,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonPage,
  IonCol,
} from '@ionic/react';
import ModalHeader from 'Components/ModalHeader';
import { funnel } from 'ionicons/icons';
import alert from 'common/helpers/alert';
import species from 'common/data/species.data.json';
import speciesGroups from 'common/data/species_groups.data.json';
import SpeciesProfile from './components/SpeciesProfile';
import UserFeedbackRequest from './components/UserFeedbackRequest';
import './images';
import './thumbnails';
import './maps';
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

  const checkboxes = Object.keys(sizes).map(size => ({
    name: 'size',
    type: 'checkbox',
    label: sizes[size],
    value: size,
    checked: currentValue.includes(size),
  }));

  alert({
    header: t('Filter species size'),
    inputs: checkboxes,

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
    savedSamples: PropTypes.object.isRequired,
    onSpeciesClick: PropTypes.func,
  };

  state = { showModal: false, species: null };

  showSpeciesModal = id => {
    this.setState({ showModal: true, species: species[id - 1] });
  };

  hideSpeciesModal = () => {
    this.setState({ showModal: false });
  };

  getFiltersHeader = () => {
    const { appModel } = this.props;

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

    const speciesFilter = appModel.get('speciesFilter');
    const byCountry = sp => country === 'ELSEWHERE' || sp[country];
    const shouldFilter = speciesFilter.length && !isRecordingMode;
    const byEnabledFilters = sp =>
      shouldFilter ? speciesFilter.find(filter => sp[filter]) : true;
    const bySpeciesId = (sp1, sp2) => sp1.sort_id - sp2.sort_id;

    const filteredSpecies = [...species]
      .filter(byCountry)
      .filter(byEnabledFilters)
      .sort(bySpeciesId);

    return isRecordingMode
      ? [...filteredSpecies, ...speciesGroups]
      : filteredSpecies;
  };

  getSpeciesGrid() {
    const { onSpeciesClick } = this.props;

    const speciesList = this.getSpecies();

    const getSpeciesElement = sp => {
      const { id, english, group, taxon = '' } = sp;

      const onClick = onSpeciesClick
        ? () => onSpeciesClick(sp)
        : () => this.showSpeciesModal(id);

      const backgroundImage = group
        ? `url('/images/${taxon.toLowerCase()}_thumbnail.png')`
        : `url('/images/${id}_thumbnail.jpg'`;

      return (
        <IonCol
          key={id}
          className="species-list-item"
          onClick={onClick}
          size="6"
          size-lg
          class="ion-no-padding ion-no-margin"
        >
          <div
            style={{
              backgroundImage,
            }}
          >
            <span className="label">{t(english)}</span>
          </div>
        </IonCol>
      );
    };

    const speciesColumns = speciesList.map(getSpeciesElement);

    return (
      <IonGrid class="ion-no-padding ion-no-margin">
        <IonRow class="ion-no-padding ion-no-margin">{speciesColumns}</IonRow>
      </IonGrid>
    );
  }

  getList = () => {
    const { savedSamples, onSpeciesClick } = this.props;

    const isNotRecordingMode = !onSpeciesClick;
    const samplesLength = savedSamples.length;

    return (
      <IonContent id="home-species" class="ion-padding">
        {isNotRecordingMode && (
          <UserFeedbackRequest
            samplesLength={samplesLength}
            appModel={this.props.appModel}
          />
        )}

        {this.getSpeciesGrid()}

        <IonModal isOpen={this.state.showModal} backdropDismiss={false}>
          <ModalHeader title={t('Species')} onClose={this.hideSpeciesModal} />
          {this.state.showModal && (
            <SpeciesProfile species={this.state.species} />
          )}
        </IonModal>
      </IonContent>
    );
  };

  render() {
    const { onSpeciesClick } = this.props;

    const isRecordingMode = !!onSpeciesClick;
    if (isRecordingMode) {
      return this.getList();
    }

    return (
      <IonPage>
        {this.getFiltersHeader()}

        {this.getList()}
      </IonPage>
    );
  }
}

export default Component;
