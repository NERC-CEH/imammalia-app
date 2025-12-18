import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Trans as T } from 'react-i18next';
import { useAlert, useToast, device, getRelativeDate } from '@flumens';
import {
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  IonAvatar,
  IonBadge,
  NavContext,
} from '@ionic/react';
import Sample, { useValidateCheck } from 'models/sample';
import { useUserStatusCheck } from 'models/user';
import deerIcon from 'Survey/common/images/deer.svg';
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

const Survey = ({ sample, uploadIsPrimary }: Props) => {
  const { navigate } = useContext(NavContext);

  const deleteSurvey = useDeleteAlert(sample);
  const toast = useToast();
  const checkUserStatus = useUserStatusCheck();
  const checkSampleStatus = useValidateCheck(sample);

  let href;
  if (!sample.isSynchronising) {
    href = `/survey/${sample.cid}`;
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

  const openItem = () => {
    if (sample.isSynchronising) return; // fixes button onPressUp and other accidental navigation
    navigate(href!);
  };

  const occ = sample.occurrences[0];
  const image = occ?.media.length && occ?.media[0];
  let avatar = <IonIcon icon={deerIcon} color="warning" />;

  if (image) {
    avatar = <img src={image.getURL()} className="w-full h-full" />;
  }

  const prettyDate = getRelativeDate(sample.data.date);

  const label = occ?.data?.taxon?.english || 'Record';

  return (
    <IonItemSliding className="survey-list-item">
      <IonItem onClick={openItem} detail={false}>
        <div className="flex gap-2 w-full items-center justify-between text-sm">
          <div className="flex gap-1 justify-start">
            <IonAvatar className="border border-neutral-200">
              {avatar}
            </IonAvatar>
            <div className="flex flex-col justify-center">
              <div className="font-semibold">
                <T>{label}</T>
              </div>
              <div className="badge-wrapper">
                <div className="ion-text-wrap">{prettyDate}</div>
                {sample.metadata.training && (
                  <IonBadge>
                    <T>Training</T>
                  </IonBadge>
                )}
              </div>
            </div>
          </div>

          <OnlineStatus
            sample={sample}
            onUpload={onUpload}
            uploadIsPrimary={!!uploadIsPrimary}
          />
        </div>
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
