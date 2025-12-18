import { useEffect, useContext } from 'react';
import { useRouteMatch } from 'react-router';
import { useAlert } from '@flumens';
import { NavContext } from '@ionic/react';
import appModel from 'models/app';
import samples from 'models/collections/samples';
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

async function getNewSample(survey: typeof SurveyConfig) {
  const sample = await survey!.create!();
  await sample.save();

  samples.push(sample);
  appModel.data.recordDraftId = sample.cid;
  await appModel.save();

  return sample;
}

async function getDraft(alert: any) {
  const draftID = appModel.data.recordDraftId;
  if (draftID) {
    const byId = ({ cid }: any) => cid === draftID;
    const draftSample = samples.find(byId);
    // if (draftSample && !draftSample.isDisabled) {
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
  const match = useRouteMatch();

  const pickDraftOrCreateSampleWrap = () => {
    const pickDraftOrCreateSample = async () => {
      let sample = await getDraft(alert);
      if (!sample) {
        sample = await getNewSample(survey);
      }

      if (!sample) return;

      const url = `/survey/${sample.cid}`;

      navigate(url, 'none', 'replace');
    };

    pickDraftOrCreateSample();
  };

  useEffect(pickDraftOrCreateSampleWrap, [match.url]);

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
