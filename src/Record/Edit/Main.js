import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IonList, IonItem, IonIcon, IonLabel, IonContent } from '@ionic/react';
import { map, calendar, clipboard } from 'ionicons/icons';
import { observer } from 'mobx-react';
import './styles.scss';
import './skull.svg';
import './deer.svg';
import './binoculars.svg';
import './number.svg';

@observer
class Record extends Component {
  static propTypes = {
    sample: PropTypes.object.isRequired,
  };

  render() {
    const { sample } = this.props;

    return (
      <IonContent id="record-edit">
        <IonList lines="full">
          <IonItem href={`/record/${sample.cid}/edit/species`} detail disabled>
            <IonIcon src="/images/deer.svg" slot="start" />
            <IonLabel>{t('Species')}</IonLabel>
          </IonItem>
          <IonItem href={`/record/${sample.cid}/edit/location`} detail disabled>
            <IonIcon icon={map} slot="start" />
            <IonLabel>{t('Location')}</IonLabel>
          </IonItem>
          <IonItem href={`/record/${sample.cid}/edit/date`} detail disabled>
            <IonIcon icon={calendar} slot="start" />
            <IonLabel>{t('Date')}</IonLabel>
          </IonItem>
          <IonItem href={`/record/${sample.cid}/edit/number`} detail disabled>
            <IonIcon src="/images/number.svg" slot="start" />
            <IonLabel>{t('Number')}</IonLabel>
          </IonItem>
          <IonItem href={`/record/${sample.cid}/edit/method`} detail disabled>
            <IonIcon src="/images/binoculars.svg" slot="start" />
            <IonLabel>{t('Method')}</IonLabel>
          </IonItem>
          <IonItem href={`/record/${sample.cid}/edit/type`} detail disabled>
            <IonIcon src="/images/skull.svg" slot="start" />
            <IonLabel>{t('Type')}</IonLabel>
          </IonItem>
          <IonItem href={`/record/${sample.cid}/edit/comment`} detail disabled>
            <IonIcon icon={clipboard} slot="start" />
            <IonLabel>{t('Comment')}</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    );
  }
}

export default Record;
