import { FC } from 'react';
import { useAlert, useToast, date, device } from '@flumens';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonBadge,
} from '@ionic/react';
import { Trans as T } from 'react-i18next';
import deerIcon from 'Record/common/images/deer.svg';
import OnlineStatus from './OnlineStatus';
import './styles.scss';

const useDeleteAlert = (sample: Sample) => {
  const alert = useAlert();

  const alertDialog = () => {
    alert({
      header: 'Delete',
      message: 'Are you sure you want to delete this record?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'primary',
        },
        {
          text: 'Delete',
          cssClass: 'danger',
          handler: () => sample.destroy(),
        },
      ],
    });
  };
  return alertDialog;
};

type Props = {
  sample: Sample;
  uploadIsPrimary?: boolean;
};

const Survey: FC<Props> = ({ sample, uploadIsPrimary }) => {
  const deleteSurvey = useDeleteAlert(sample);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);
  const survey = sample.getSurvey();

  const { synchronising } = sample.remote;

  let href;
  if (!synchronising) {
    href = `/record/${survey.name}/${sample.cid}`;
  }

  function getSampleInfo() {
    const occ = sample.occurrences[0];

    const prettyDate = date.print(sample.attrs.date);

    const image = occ?.media.length && occ?.media[0];
    let avatar = <IonIcon icon={deerIcon} color="warning" />;

    if (image) {
      avatar = <img src={image.getURL()} />;
    }

    const label = occ?.attrs?.taxon?.english || 'Record';

    return (
      <>
        <IonAvatar>{avatar}</IonAvatar>
        <IonLabel position="stacked" mode="ios" color="dark">
          <IonLabel className="species-name bold">
            <T>{label}</T>
          </IonLabel>
          <div className="badge-wrapper">
            <IonLabel class="ion-text-wrap">{prettyDate}</IonLabel>
            {sample.metadata.training && (
              <IonBadge>
                <T>Training</T>
              </IonBadge>
            )}
          </div>
        </IonLabel>
      </>
    );
  }

  const onUpload = async () => {
    const isValid = checkSampleStatus();
    if (!isValid) return;

    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return;
    }

    const isUserOK = await checkUserStatus();
    if (!isUserOK) return;

    sample.upload().catch(toast.error);
  };

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem routerLink={href} detail={!synchronising}>
        {getSampleInfo()}

        <OnlineStatus
          sample={sample}
          onUpload={onUpload}
          uploadIsPrimary={!!uploadIsPrimary}
        />
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={deleteSurvey}>
          <T>Delete</T>
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default observer(Survey);
