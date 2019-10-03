import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Sample from 'sample';
import Occurrence from 'occurrence';
import alert from 'common/helpers/alert';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';

async function createNewSample(savedSamples) {
  const sample = new Sample();
  const occurrence = new Occurrence();
  sample.addOccurrence(occurrence);

  // add to main collection
  savedSamples.add(sample);
  return sample;
}

async function showDraftAlert() {
  return new Promise(resolve => {
    alert({
      header: t('Draft'),
      message: `${t(
        'Previous record draft exists, would you like to continue it?'
      )}`,
      backdropDismiss: false,
      buttons: [
        {
          text: t('Discard'),
          handler: () => {
            resolve(false);
          },
        },
        {
          text: t('Continue'),
          cssClass: 'primary',
          handler: () => {
            resolve(true);
          },
        },
      ],
    });
  });
}

function showValidationAlert(errors) {
  const errorsPretty = errors.errors.reduce(
    (agg, err) => `${agg} ${t(err)}`,
    ''
  );
  alert({
    header: t('Record incomplete'),
    message: `${errorsPretty}`,
  });
}

function increaseCount(occ) {
  const count = occ.get('count');
  occ.set('count', count + 1);
  occ.save();
}

function deleteOccurrence(occ) {
  const taxon = occ.get('taxon').scientific_name;
  alert({
    header: t('Delete'),
    message: `${t('Are you sure you want to delete')} ${taxon}?`,
    buttons: [
      {
        text: t('Cancel'),
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: t('Delete'),
        cssClass: 'secondary',
        handler: () => {
          occ.destroy();
        },
      },
    ],
  });
}

@observer
class Container extends React.Component {
  static propTypes = {
    savedSamples: PropTypes.object.isRequired,
    match: PropTypes.object,
    history: PropTypes.object,
    appModel: PropTypes.object.isRequired,
  };

  state = { sample: null };

  async componentDidMount() {
    const { savedSamples, match, history } = this.props;
    const sampleID = match.params.id;

    if (sampleID === 'new') {
      const newSample = await this.getNewSample();
      history.replace(`/record/${newSample.cid}/edit`);
      this.setState({ sample: newSample });
      return;
    }

    this.setState({ sample: savedSamples.get(sampleID) });
  }

  async getNewSample() {
    const { savedSamples, appModel } = this.props;
    const draftID = appModel.get('recordDraftId');
    let continueDraftRecord = false;
    if (draftID) {
      continueDraftRecord = await showDraftAlert();
    }
    if (continueDraftRecord) {
      return savedSamples.get(draftID);
    }

    const sample = await createNewSample(savedSamples);
    sample.toggleGPStracking();

    appModel.set('recordDraftId', sample.cid);
    await appModel.save();
    return sample.save();
  }

  onSubmit = async () => {
    const { appModel, history } = this.props;
    const { sample } = this.state;
    const errors = await sample.validateRemote();
    if (errors) {
      showValidationAlert(errors);
      return;
    }

    appModel.set('recordDraftId', null);
    await appModel.save();

    sample.toggleGPStracking(false);

    sample.metadata.saved = true;
    sample.save(null, { remote: true });
    history.replace(`/home/user-records`);
  };

  navigateToOccurrence = occ => {
    const { match, history } = this.props;
    const sampleID = match.params.id;

    history.push(`/record/${sampleID}/edit/occ/${occ.cid}`);
  };

  render() {
    const { history } = this.props;

    if (!this.state.sample) {
      return null;
    }

    const isTraining = this.state.sample.metadata.training;
    return (
      <>
        <Header onSubmit={this.onSubmit} isTraining={isTraining} />
        <Main
          sample={this.state.sample}
          onSubmit={this.onSubmit}
          deleteOccurrence={deleteOccurrence}
          increaseCount={increaseCount}
          navigateToOccurrence={this.navigateToOccurrence}
          onToggleSpeciesSort={this.toggleSpeciesSort}
          history={history}
        />
        <Footer sample={this.state.sample} />
      </>
    );
  }
}

export default Container;
