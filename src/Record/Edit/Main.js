import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IonList, IonItem, IonIcon, IonLabel, IonContent } from '@ionic/react';
import { map, calendar, clipboard } from 'ionicons/icons';
import { observer } from 'mobx-react';
import dateHelp from 'helpers/date';
import './styles.scss';
import './skull.svg';
import './footprint.svg';
import './deer.svg';
import './binoculars.svg';
import './number.svg';
import './gender.svg';
import './age.svg';
import './boar.svg';

const { print: prettyDate } = dateHelp;

@observer
class Record extends Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
  };

  getBoarSpecificAttributes = () => {
    const { sample } = this.props;
    const occ = sample.occurrences.at(0);
    const { gender, age, decomposition, taxon } = occ.attributes;

    const WILD_BOAR = 'Sus scrofa';
    if (!taxon || taxon.taxon !== WILD_BOAR) {
      return null;
    }

    return (
      <>
        <IonItem routerLink={`/record/${sample.cid}/edit/gender`} detail>
          <IonIcon src="/images/gender.svg" slot="start" />
          <IonLabel>{t('Gender')}</IonLabel>
          <IonLabel slot="end">{t(gender)}</IonLabel>
        </IonItem>
        <IonItem routerLink={`/record/${sample.cid}/edit/age`} detail>
          <IonIcon src="/images/age.svg" slot="start" />
          <IonLabel>{t('Age')}</IonLabel>
          <IonLabel slot="end">{t(age)}</IonLabel>
        </IonItem>
        <IonItem routerLink={`/record/${sample.cid}/edit/decomposition`} detail>
          <IonIcon src="/images/skull.svg" slot="start" />
          <IonLabel>{t('Decomposition')}</IonLabel>
          <IonLabel slot="end">{t(decomposition)}</IonLabel>
        </IonItem>
      </>
    );
  };

  render() {
    const { sample } = this.props;
    const occ = sample.occurrences.at(0);
    const { location, date } = sample.attributes;
    const { taxon, method, type, comment } = occ.attributes;
    const species = taxon.english && t(taxon.english);

    const prettyNumber =
      occ.attributes.number || occ.attributes['number-ranges'];

    const isGPSTracking = sample.isGPSRunning();
    let prettyLocation;
    if (isGPSTracking) {
      prettyLocation = (
        <span className="warn">
          {t('Locating')}
          ...
        </span>
      );
    } else if (location && location.latitude) {
      const { latitude, longitude } = location || {};
      prettyLocation = (
        <span>{`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`}</span>
      );
    }
    const { source } = location || {};

    const locationAccuracy =
      isGPSTracking || source === 'gps'
        ? ''
        : sample.get('manual_location_accuracy');

    return (
      <IonContent id="record-edit">
        <IonList lines="full">
          <IonItem routerLink={`/record/${sample.cid}/edit/species`} detail>
            <IonIcon src="/images/deer.svg" slot="start" />
            <IonLabel>{t('Species')}</IonLabel>
            <IonLabel slot="end">{species}</IonLabel>
          </IonItem>
          <IonItem
            class="record-location"
            routerLink={`/record/${sample.cid}/edit/location`}
            detail
          >
            <IonIcon icon={map} slot="start" />
            <IonLabel>{t('Location')}</IonLabel>
            <IonLabel slot="end">
              {prettyLocation}
              {locationAccuracy && (
                <span className="record-location-accuracy">
                  {locationAccuracy}
                </span>
              )}
            </IonLabel>
          </IonItem>
          <IonItem routerLink={`/record/${sample.cid}/edit/date`} detail>
            <IonIcon icon={calendar} slot="start" />
            <IonLabel>{t('Date')}</IonLabel>
            <IonLabel slot="end">{prettyDate(date, true)}</IonLabel>
          </IonItem>
          <IonItem routerLink={`/record/${sample.cid}/edit/number`} detail>
            <IonIcon src="/images/number.svg" slot="start" />
            <IonLabel>{t('Number')}</IonLabel>
            <IonLabel slot="end">{prettyNumber}</IonLabel>
          </IonItem>
          <IonItem routerLink={`/record/${sample.cid}/edit/method`} detail>
            <IonIcon src="/images/binoculars.svg" slot="start" />
            <IonLabel>{t('Method')}</IonLabel>
            <IonLabel slot="end">{t(method)}</IonLabel>
          </IonItem>
          <IonItem routerLink={`/record/${sample.cid}/edit/type`} detail>
            <IonIcon src="/images/footprint.svg" slot="start" />
            <IonLabel>{t('Type')}</IonLabel>
            <IonLabel slot="end">{t(type)}</IonLabel>
          </IonItem>

          {this.getBoarSpecificAttributes()}

          <IonItem routerLink={`/record/${sample.cid}/edit/comment`} detail>
            <IonIcon icon={clipboard} slot="start" />
            <IonLabel>{t('Comment')}</IonLabel>
            <IonLabel slot="end">{comment}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    );
  }
}

export default Record;
