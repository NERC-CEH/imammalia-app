import React from 'react';
import { IonContent, IonList, IonItem } from '@ionic/react';
import './images';

const Component = () => (
  <>
    <IonContent id="home-report" class="ion-padding">
      <IonList lines="full">
        {[...new Array(43)].map((_, id) => (
          <IonItem key={Math.random()}>
            <img src={`/images/${id + 1}.jpg`} alt="" />
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  </>
);

Component.propTypes = {};

export default Component;
