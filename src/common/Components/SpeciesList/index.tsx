import { FC, useState, SyntheticEvent } from 'react';
import { Main, UserFeedbackRequest } from '@flumens';
import { Trans as T } from 'react-i18next';
import { AppModel } from 'models/app';
import { UserModel } from 'models/user';
import SavedSamples from 'models/savedSamples';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import species from 'common/data/species.data.json';
import CONFIG from 'common/config';
import speciesGroups from 'common/data/species_groups.data.json';
import SpeciesProfile from './components/SpeciesProfile';
import './images';
import './thumbnails';
import './maps';
import './styles.scss';

export interface Species {
  id: number;
  warehouse_id: number;
  sort_id: number;
  english: string;
  taxon: string;
  mammalnet_website_path: string;
  order: string;
  family: string;
  description: string;
  aquatic: number;
  river: number;
  tree: number;
  underground: number;
  forest: number;
  shrubs: number;
  alpine: number;
  prairies: number;
  farmlands: number;
  xxxs: number;
  xxs: number;
  xs: number;
  s: number;
  m: number;
  l: number;
  xl: number;
  xxl: number;
  grouping: string;
  AL: number;
  AT: number;
  BY: number;
  BE: number;
  BA: number;
  BG: number;
  HR: number;
  CZ: number;
  EE: number;
  FI: number;
  FR: number;
  DE: number;
  GR: number;
  HU: number;
  IS: number;
  IE: number;
  IT: number;
  XK: number;
  LV: number;
  LT: number;
  LU: number;
  MK: number;
  MT: number;
  MD: number;
  ME: number;
  NL: number;
  NO: number;
  PL: number;
  PT: number;
  RO: number;
  RS: number;
  SK: number;
  SI: number;
  ES: number;
  SE: number;
  CH: number;
  TR: number;
  UA: number;
  UK: number;
  photoAttribution?: string;
}

type Props = {
  appModel: AppModel;
  savedSamples: typeof SavedSamples;
  userModel: UserModel;
  onSpeciesClick?: (sp: Species) => void;
};
const SpeciesController: FC<Props> = ({
  appModel,
  savedSamples,
  userModel,
  onSpeciesClick,
}) => {
  const isRecordingMode = !!onSpeciesClick;

  const [speciesProfile, setSpeciesProfile] = useState<any | null>(null);

  const hideSpeciesModal = () => setSpeciesProfile(null);

  const onFeedbackDone = () => {
    // eslint-disable-next-line no-param-reassign
    appModel.attrs.feedbackGiven = true;
    appModel.save();
  };

  const isNotRecordingMode = !onSpeciesClick;

  const shouldShowFeedback = () => {
    if (isNotRecordingMode) return false;

    if (appModel.attrs.feedbackGiven) {
      return false;
    }

    if (appModel.attrs.useTraining) {
      return false;
    }

    if (!userModel.isLoggedIn()) {
      return false;
    }

    return savedSamples.length > 5;
  };

  const getSpecies = () => {
    const { country } = appModel.attrs;

    const { speciesFilter } = appModel.attrs;
    const byCountry = (sp: any) => country === 'ELSEWHERE' || sp[country];
    const shouldFilter = speciesFilter?.length && !isRecordingMode;
    const byEnabledFilters = (sp: any) =>
      shouldFilter ? speciesFilter.find((filter: any) => sp[filter]) : true;
    const bySpeciesId = (sp1: Species, sp2: Species) =>
      sp1.sort_id - sp2.sort_id;

    const filteredSpecies = [...species]
      .filter(byCountry)
      .filter(byEnabledFilters)
      .sort(bySpeciesId);

    const speciesGroupsToShow = speciesGroups
      .filter(({ show }) => show)
      .map(group => ({ ...group, group: true }));

    return isRecordingMode
      ? [...filteredSpecies, ...speciesGroupsToShow]
      : filteredSpecies;
  };

  const getSpeciesGrid = () => {
    const speciesList = getSpecies();

    const getSpeciesElement = (sp: any) => {
      const { id, english, group, taxon = '' } = sp;

      const backgroundImage = group
        ? `url('/images/${taxon.toLowerCase()}_thumbnail.png')`
        : `url('/images/${id}_thumbnail.jpg'`;

      const viewSpecies = (e: SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setSpeciesProfile(sp);
      };

      const selectSpecies = () => isRecordingMode && onSpeciesClick(sp);

      const onClick = isRecordingMode ? selectSpecies : viewSpecies;

      return (
        <IonCol
          key={id + english}
          className="species-list-item"
          onClick={onClick}
          size="6"
          size-lg
          class="ion-no-padding ion-no-margin"
        >
          <div
            style={{
              backgroundImage,
            }}
          >
            <span className="label">
              <T>{english}</T>
            </span>
          </div>
        </IonCol>
      );
    };

    const speciesColumns = speciesList.map(getSpeciesElement);

    return (
      <IonGrid class="ion-no-padding ion-no-margin">
        <IonRow class="ion-no-padding ion-no-margin">{speciesColumns}</IonRow>
      </IonGrid>
    );
  };

  const showFeedback = shouldShowFeedback();

  return (
    <Main className="species-list">
      {showFeedback && (
        <UserFeedbackRequest
          email={CONFIG.feedbackEmail}
          onFeedbackDone={onFeedbackDone}
        />
      )}

      {getSpeciesGrid()}

      <SpeciesProfile species={speciesProfile} onClose={hideSpeciesModal} />
    </Main>
  );
};

export default SpeciesController;
