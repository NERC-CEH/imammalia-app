import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { Page, Header, useToast, device } from '@flumens';
import { IonButton, NavContext } from '@ionic/react';
import { AppModel } from 'models/app';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: Sample;
  appModel: AppModel;
};

const Home = ({ sample, appModel }: Props) => {
  const { navigate } = useContext(NavContext);
  const isDisabled = sample.isUploaded;
  const isEditing = sample.metadata.saved;
  const toast = useToast();

  const checkSampleStatus = useValidateCheck(sample);

  const checkUserStatus = useUserStatusCheck();

  const isTraining = !!sample.metadata.training;

  const onUpload = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    const isUploading = await sample.upload().catch(toast.error);
    if (!isUploading) return;

    navigate(`/home/user-records`, 'root');
  };

  const processDraft = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    // eslint-disable-next-line
    appModel.data.recordDraftId = null;
    await appModel.save();

    // eslint-disable-next-line
    sample.metadata.saved = true;
    sample.save();

    navigate(`/home/user-records`, 'root');
  };

  const onFinish = async () => {
    if (!sample.metadata.saved) {
      await processDraft();
      return;
    }

    await onUpload();
  };

  const finishButton = isDisabled ? null : (
    <IonButton className="finish-button" onClick={onFinish}>
      {isEditing ? <T>Upload</T> : <T>Finish</T>}
    </IonButton>
  );

  const trainingModeSubheader = isTraining && (
    <div className="training-subheader">
      <T>Training Mode</T>
    </div>
  );

  return (
    <Page id="record">
      <Header
        title="Record"
        defaultHref="/home/surveys"
        rightSlot={finishButton}
        subheader={trainingModeSubheader}
      />
      <Main sample={sample} />
    </Page>
  );
};

export default observer(Home);
