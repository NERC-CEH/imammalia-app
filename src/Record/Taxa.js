import React from 'react';
import PropTypes from 'prop-types';
import AppHeader from 'Components/Header';
import Species from 'Home/Species';
import { observer } from 'mobx-react';

@observer
class Component extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    savedSamples: PropTypes.object.isRequired,
    appModel: PropTypes.object.isRequired,
  };

  // eslint-disable-next-line camelcase
  onSpeciesClick = ({ english, taxon, warehouse_id, id }) => {
    const { history, match, savedSamples } = this.props;

    const sampleID = match.params.id;
    const sample = savedSamples.get(sampleID);
    const occ = sample.occurrences.at(0);

    const species = { english, taxon, warehouse_id, id };
    occ.set('taxon', species);

    sample.save();
    history.replace(`/record/${sampleID}/edit`);
  };

  render() {
    return (
      <>
        <AppHeader title={t('Select species')} />
        <Species
          appModel={this.props.appModel}
          onSpeciesClick={this.onSpeciesClick}
        />
      </>
    );
  }
}
export default Component;
