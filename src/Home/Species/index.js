import React from 'react';
import { IonContent, IonList, IonItem } from '@ionic/react';
import './images';
import './styles.scss';
import species from './species.data.json';

let lastScroll = 0;

class Component extends React.Component {
  constructor(props) {
    super(props);
    this.infiniteScrollRef = React.createRef();
    this.contentRef = React.createRef();
    this.scroll = this.scroll.bind(this);
    this.state = { listShowLimit: 30 };
  }

  scroll(e) {
    this.setState({
      listShowLimit: this.state.listShowLimit + 30,
    });
    e.target.complete();

    if (this.state.listShowLimit >= 44) {
      e.target.disabled = true;
    }
  }

  componentDidMount() {
    if (!this.infiniteScrollRef.current) {
      return;
    }
    this.infiniteScrollRef.current.addEventListener('ionInfinite', this.scroll);

    this.contentRef.current.scrollToPoint(lastScroll);
  }

  componentWillUnmount() {
    if (!this.infiniteScrollRef.current) {
      return;
    }
    this.contentRef.current.getScrollElement().then(el => {
      lastScroll = el.scrollTop;
    });
    this.infiniteScrollRef.current.removeEventListener(
      'ionInfinite',
      this.scroll
    );
  }

  render() {
    return (
      <IonContent
        id="home-species"
        class="ion-padding"
        // ref={this.contentRef}
        // forceOverscroll={false}
      >
        <IonList lines="full">
          {[...new Array(43)].map((_, id) => (
            <IonItem key={Math.random()} className="species-list-item">
              <div
                style={{
                  backgroundImage: `url('/images/${id + 1}.jpg')`,
                }}
              >
                <span className="label">{species[id].english}</span>
              </div>
            </IonItem>
          ))}
          {/* <ion-infinite-scroll threshold="300px" ref={this.infiniteScrollRef}>
            <ion-infinite-scroll-content />
          </ion-infinite-scroll> */}
        </IonList>
      </IonContent>
    );
  }
}

// Component.propTypes = {};

export default Component;
