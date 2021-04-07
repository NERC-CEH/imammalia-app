import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { IonPage } from '@ionic/react';
import Header from './Header';
import Main from './Main';
import './styles.scss';

@observer
class Container extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    savedSamples: PropTypes.object.isRequired,
  };

  state = {};

  toggleGPStracking = () => {
    const { match, savedSamples } = this.props;
    const sample = savedSamples.get(match.params.id);
    sample.toggleGPStracking();
  };

  setLocation = location => {
    const { match, savedSamples } = this.props;
    const sample = savedSamples.get(match.params.id);

    if (sample.isGPSRunning()) {
      sample.stopGPS();
    }

    sample.setLocation(location);
  };

  setLocationAccuracy = acc => {
    const { match, savedSamples } = this.props;
    const sample = savedSamples.get(match.params.id);

    sample.set('manual_location_accuracy', acc.detail.value);
    sample.save();
  };

  render() {
    const { match, savedSamples } = this.props;

    const sample = savedSamples.get(match.params.id);

    const location = sample.get('location');
    const accuracy = sample.get('manual_location_accuracy');
    const isGPSTracking = sample.isGPSRunning();

    return (
      <IonPage>
        <Header />
        <Main
          location={location}
          isGPSTracking={isGPSTracking}
          accuracy={accuracy}
          toggleGPStracking={this.toggleGPStracking}
          setLocation={this.setLocation}
          setLocationAccuracy={this.setLocationAccuracy}
        />
      </IonPage>
    );
  }
}

export default Container;
