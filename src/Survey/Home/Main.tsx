import { observer } from 'mobx-react';
import clsx from 'clsx';
import { calendarOutline, mapOutline, informationCircle } from 'ionicons/icons';
import { Trans as T } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import {
  Main,
  MenuAttrItem,
  Attr,
  MenuAttrItemFromModel,
  InfoMessage,
} from '@flumens';
import { IonList, IonLabel, IonButton, IonIcon } from '@ionic/react';
import CONFIG from 'common/config';
import Sample from 'models/sample';
import GridRefValue from 'Survey/common/Components/GridRefValue';
import PhotoPicker from 'Survey/common/Components/PhotoPicker';
import deerIcon from 'Survey/common/images/deer.svg';
import numberIcon from 'Survey/common/images/number.svg';

type Props = {
  sample: Sample;
};

const WILD_BOAR = 'Sus scrofa';

const HomeMain = ({ sample }: Props) => {
  const [occ] = sample.occurrences;
  const { url } = useRouteMatch();

  const isDisabled = sample.isUploaded;

  const speciesValue = sample?.occurrences[0]?.data?.taxon?.english;

  const getLocationButton = () => {
    const locationAccuracy = sample.isGPSRunning()
      ? ''
      : sample.data.manual_location_accuracy;

    const location = sample.data.location || {};
    const hasLocation = location.latitude;
    const empty = !hasLocation;

    const value = locationAccuracy ? (
      <div className="flex flex-col gap-1">
        <GridRefValue sample={sample} />
        {locationAccuracy && (
          <span className="record-location-accuracy">{locationAccuracy}</span>
        )}
      </div>
    ) : (
      <IonLabel mode="ios">
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
    const { taxon } = occ?.data || null;

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
    sample?.occurrences[0]?.data?.number ||
    sample?.occurrences[0]?.data['number-ranges'];

  return (
    <Main>
      {isDisabled && (
        <InfoMessage
          className="blue mx-2"
          prefix={<IonIcon icon={informationCircle} className="size-6" />}
          skipTranslation
        >
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
        <div className="rounded-list">
          <MenuAttrItem
            routerLink={`${url}/species`}
            icon={deerIcon}
            value={speciesValue}
            label="Species"
            required
            disabled={isDisabled}
          />

          {getLocationButton()}

          <Attr
            model={sample}
            attr="date"
            input="date"
            inputProps={{
              max: new Date().toISOString(),
              label: 'Date',
              icon: calendarOutline,
              autoFocus: false,
              presentation: 'date',
              disabled: isDisabled,
            }}
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
            skipValueTranslation
          />
        </div>

        <div className="rounded-list mt-5">
          <PhotoPicker model={occ} />
        </div>
      </IonList>
    </Main>
  );
};

export default observer(HomeMain);
