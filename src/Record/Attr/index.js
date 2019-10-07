import React from 'react';
import PropTypes from 'prop-types';
import { IonContent } from '@ionic/react';
import AppHeader from 'Components/Header';
import RadioInput from 'Components/RadioInput';
import Input from 'Components/Input';
import Textarea from 'Components/Textarea';
import { observer } from 'mobx-react';
import config from 'config';
import NumberAttr from './components/NumberAttr';

@observer
class Component extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    savedSamples: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { match, savedSamples } = props;

    const sampleID = match.params.id;
    this.attrName = match.params.attr;
    const sample = savedSamples.get(sampleID);
    this.sample = sample;
    this.occ = sample.occurrences.at(0);

    this.model = this.attrName === 'date' ? this.sample : this.occ;

    const value = this.model.get(this.attrName);
    this.state = { currentVal: value };

    this.attrConfig =
      this.attrName === 'date'
        ? config.indicia.attrs.smp.date
        : config.indicia.attrs.occ[this.attrName];
  }

  onChange = val => {
    this.setState({ currentVal: val });
    this.model.set(this.attrName, val);
    this.model.save();

    if (this.attrConfig.type === 'radio') {
      const { history, match } = this.props;
      const sampleID = match.params.id;
      history.replace(`/record/${sampleID}/edit`);
    }
  };

  onNumberChange = (val, radioWasClicked) => {
    if (!radioWasClicked) {
      this.setState({ currentVal: val[1] });
      this.model.set('number', val[1]);
      this.model.set('number-ranges', null);
      this.model.save();
      return;
    }

    this.setState({ currentVal: val[0] });
    this.model.set('number-ranges', val[0]);
    this.model.set('number', null);
    this.model.save();

    const { history, match } = this.props;
    const sampleID = match.params.id;
    history.replace(`/record/${sampleID}/edit`);
  };

  getAttr = () => {
    if (this.attrName === 'number') {
      return (
        <NumberAttr
          config={config.indicia.attrs.occ['number-ranges']}
          rangesValue={this.occ.get('number-ranges')}
          sliderValue={this.state.currentVal}
          onChange={this.onNumberChange}
        />
      );
    }

    switch (this.attrConfig.type) {
      case 'date':
        return (
          <Input
            type="date"
            config={this.attrConfig}
            default={this.state.currentVal}
            onChange={val => this.onChange(val)}
          />
        );
      case 'textarea':
        return (
          <Textarea
            config={this.attrConfig}
            info={t('Please add any extra info about this record.')}
            default={this.state.currentVal}
            onChange={val => this.onChange(val)}
          />
        );

      case 'radio':
        return (
          <RadioInput
            config={this.attrConfig}
            default={this.state.currentVal}
            onChange={val => this.onChange(val)}
          />
        );

      default:
        // TODO: show 404
        return null;
    }
  };

  render() {
    return (
      <>
        <AppHeader title={t(this.attrConfig.label)} />
        <IonContent id="record-edit-attr">{this.getAttr()}</IonContent>
      </>
    );
  }
}
export default Component;
