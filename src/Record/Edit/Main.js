import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonContent,
} from '@ionic/react';
import {
  map,
} from 'ionicons/icons';
import { observer } from 'mobx-react';
import './styles.scss';

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
          <IonItem href={`/record/${sample.cid}/edit/location`} detail>
            <IonIcon icon={map} slot="start" />
            <IonLabel>{t('Location')}</IonLabel>
          </IonItem>

        </IonList>
      </IonContent>
    );
  }
}

export default Record;
