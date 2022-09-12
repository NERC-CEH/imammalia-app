import { useEffect, useContext } from 'react';
import { NavContext } from '@ionic/react';
import Sample from 'models/sample';
import { useAlert } from '@flumens';
import appModel, { SurveyDraftKeys } from 'models/app';
import savedSamples from 'models/savedSamples';
import SurveyConfig from './config';

async function showDraftAlert(alert: any) {
  const alertWrap = (resolve: any) => {
    alert({
      header: 'Draft',
      message: 'Previous record draft exists, would you like to continue it?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Discard',
          handler: () => {
            resolve(false);
          },
        },
        {
          text: 'Continue',
          cssClass: 'primary',
          handler: () => {
            resolve(true);
          },
        },
      ],
    });
  };
  return new Promise(alertWrap);
}

async function getNewSample(
  survey: typeof SurveyConfig,
  draftIdKey: keyof SurveyDraftKeys
) {
  // const isTraining = appModel.attrs.training ? 't' : null;
  const sample = await survey.create(Sample);
  await sample.save();

  savedSamples.push(sample);
  appModel.attrs[draftIdKey] = sample.cid;
  await appModel.save();

  return sample;
}

async function getDraft(draftIdKey: keyof SurveyDraftKeys, alert: any) {
  const draftID = appModel.attrs[draftIdKey];
  if (draftID) {
    const byId = ({ cid }: any) => cid === draftID;
    const draftSample = savedSamples.find(byId);
    // if (draftSample && !draftSample.isDisabled()) {
    if (draftSample) {
      const continueDraftRecord = await showDraftAlert(alert);
      if (continueDraftRecord) {
        return draftSample;
      }

      draftSample.destroy();
    }
  }

  return null;
}

type Props = {
  survey: typeof SurveyConfig;
};

function StartNewRecord({ survey }: Props): null {
  const { navigate } = useContext(NavContext);
  const alert = useAlert();

  const baseURL = `/record/${survey.name}`;

  const draftIdKey: any = `draftId:${survey.name}`;

  const pickDraftOrCreateSampleWrap = () => {
    const pickDraftOrCreateSample = async () => {
      let sample = await getDraft(draftIdKey, alert);
      if (!sample) {
        sample = await getNewSample(survey, draftIdKey);
      }

      const url = `${baseURL}/${sample.cid}`;

      navigate(url, 'none', 'replace');
    };

    pickDraftOrCreateSample();
  };

  useEffect(pickDraftOrCreateSampleWrap, []);

  return null;
}

// eslint-disable-next-line @getify/proper-arrows/name
StartNewRecord.with = (survey: typeof SurveyConfig) => {
  const StartNewRecordWrap = (params: any) => (
    <StartNewRecord survey={survey} {...params} />
  );

  return StartNewRecordWrap;
};

export default StartNewRecord;
