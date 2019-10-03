import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
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

  setLocationAccurracy = acc => {
    const { match, savedSamples } = this.props;
    const sample = savedSamples.get(match.params.id);

    sample.set('manual_location_accuracy', acc.detail.value);
    sample.save();
  };

  render() {
    const { match, savedSamples } = this.props;

    const sample = savedSamples.get(match.params.id);

    const location = sample.get('location');
    const accurracy = sample.get('manual_location_accuracy');
    const isGPSTracking = sample.isGPSRunning();

    return (
      <>
        <Header />
        <Main
          location={location}
          isGPSTracking={isGPSTracking}
          accurracy={accurracy}
          toggleGPStracking={this.toggleGPStracking}
          setLocation={this.setLocation}
          setLocationAccurracy={this.setLocationAccurracy}
        />
      </>
    );
  }
}

export default Container;
