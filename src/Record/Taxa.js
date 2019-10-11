import React from 'react';
import PropTypes from 'prop-types';
import { IonPage, NavContext } from '@ionic/react';
import AppHeader from 'Components/Header';
import Species from 'Home/Species';
import { observer } from 'mobx-react';

@observer
class Component extends React.Component {
  static contextType = NavContext;

  static propTypes = {
    match: PropTypes.object,
    savedSamples: PropTypes.object.isRequired,
    appModel: PropTypes.object.isRequired,
  };

  // eslint-disable-next-line camelcase
  onSpeciesClick = ({ english, taxon, warehouse_id, id }) => {
    const { match, savedSamples } = this.props;

    const sampleID = match.params.id;
    const sample = savedSamples.get(sampleID);
    const occ = sample.occurrences.at(0);

    const species = { english, taxon, warehouse_id, id };
    occ.set('taxon', species);

    sample.save();
    this.context.goBack();
  };

  render() {
    return (
      <IonPage>
        <AppHeader title={t('Select species')} />
        <Species
          appModel={this.props.appModel}
          savedSamples={this.props.savedSamples}
          onSpeciesClick={this.onSpeciesClick}
        />
      </IonPage>
    );
  }
}
export default Component;
