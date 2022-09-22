import { FC } from 'react';
import Sample from 'models/sample';
import { observer } from 'mobx-react';
import CONFIG from 'common/config';
import {
  Main,
  MenuAttrItem,
  MenuAttrItemFromModel,
  DateTimeInput,
  InfoMessage,
} from '@flumens';
import { IonList, IonLabel, IonButton } from '@ionic/react';
import { calendarOutline, mapOutline, informationCircle } from 'ionicons/icons';
import { useRouteMatch } from 'react-router';
import { Trans as T } from 'react-i18next';
import clsx from 'clsx';
import PhotoPicker from 'Record/common/Components/PhotoPicker';
import GridRefValue from 'Record/common/Components/GridRefValue';
import deerIcon from 'Record/common/images/deer.svg';
import numberIcon from 'Record/common/images/number.svg';

type Props = {
  sample: Sample;
};

const WILD_BOAR = 'Sus scrofa';

const HomeMain: FC<Props> = ({ sample }) => {
  const [occ] = sample.occurrences;
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded();

  const onChangeDate = (value: string) => {
    // eslint-disable-next-line
    sample.attrs.date = value;
    sample.save();
  };

  const dateValue = new Date(sample.attrs.date as any).toISOString();

  const speciesValue = sample?.occurrences[0]?.attrs?.taxon?.english;

  const getLocationButton = () => {
    const locationAccuracy = sample.isGPSRunning()
      ? ''
      : sample.attrs.manual_location_accuracy;

    const location = sample.attrs.location || {};
    const hasLocation = location.latitude;
    const empty = !hasLocation;

    const value = locationAccuracy ? (
      <IonLabel position="stacked" mode="ios">
        <IonLabel mode="ios">
          <GridRefValue sample={sample} />
        </IonLabel>
        {locationAccuracy && (
          <IonLabel mode="ios">
            <span className="record-location-accuracy">{locationAccuracy}</span>
          </IonLabel>
        )}
      </IonLabel>
    ) : (
      <IonLabel>
        <GridRefValue sample={sample} />
      </IonLabel>
    );

    return (
      <MenuAttrItem
        routerLink={`${url}/location`}
        value={value}
        icon={mapOutline}
        label="Location"
        required
        className={clsx({ empty })}
        skipValueTranslation
        disabled={isDisabled}
      />
    );
  };

  const getBoarSpecificAttributes = () => {
    const { taxon } = occ?.attrs || null;

    if (!taxon || taxon.taxon !== WILD_BOAR) {
      return null;
    }

    return (
      <>
        <MenuAttrItemFromModel
          attr="gender"
          model={occ}
          routerLink={`${url}/${occ?.cid}/gender`}
        />

        <MenuAttrItemFromModel
          attr="age"
          model={occ}
          routerLink={`${url}/${occ?.cid}/age`}
        />

        <MenuAttrItemFromModel
          attr="decomposition"
          model={occ}
          routerLink={`${url}/${occ?.cid}/decomposition`}
        />
      </>
    );
  };

  const numberValue =
    sample?.occurrences[0]?.attrs?.number ||
    sample?.occurrences[0]?.attrs['number-ranges'];

  return (
    <Main>
      {isDisabled && (
        <InfoMessage className="blue" icon={informationCircle} skipTranslation>
          <T>
            This record has been submitted and cannot be edited within this App.
          </T>
          <IonButton
            href={`${CONFIG.backend.url}/record/details?occurrence_id=${occ.id}`}
            expand="block"
            color="dark"
            fill="outline"
            size="small"
            className="website-link"
          >
            <T>iMammalia website</T>
          </IonButton>
        </InfoMessage>
      )}

      <IonList lines="full">
        <div className="rounded">
          <MenuAttrItem
            routerLink={`${url}/species`}
            icon={deerIcon}
            value={speciesValue}
            label="Species"
            required
            disabled={isDisabled}
          />

          {getLocationButton()}

          <DateTimeInput
            value={dateValue}
            onChange={onChangeDate}
            presentation="date"
            label="Date"
            autoFocus={false}
            icon={calendarOutline}
            disabled={isDisabled}
            max={new Date().toISOString()}
          />

          <MenuAttrItem
            routerLink={`${url}/${occ?.cid}/number`}
            icon={numberIcon}
            value={numberValue}
            label="Number"
            disabled={isDisabled}
          />

          <MenuAttrItemFromModel
            attr="method"
            model={occ}
            routerLink={`${url}/${occ?.cid}/method`}
          />
          <MenuAttrItemFromModel
            attr="type"
            model={occ}
            routerLink={`${url}/${occ?.cid}/type`}
          />

          {getBoarSpecificAttributes()}

          <MenuAttrItemFromModel
            attr="comment"
            model={occ}
            routerLink={`${url}/${occ?.cid}/comment`}
          />
        </div>

        <div className="rounded">
          <PhotoPicker model={occ} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(HomeMain);
