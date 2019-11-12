import React from 'react';
import PropTypes from 'prop-types';
import alert from 'common/helpers/alert';
import { observer } from 'mobx-react';
import {
  IonItem,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { open } from 'ionicons/icons';
import config from 'config';
import OnlineStatus from './components/OnlineStatus';
import ErrorMessage from './components/ErrorMessage';

function deleteRecord(sample) {
  alert({
    header: t('Delete'),
    message: t('Are you sure you want to delete this record?'),
    buttons: [
      {
        text: t('Cancel'),
        role: 'cancel',
        cssClass: 'primary',
      },
      {
        text: t('Delete'),
        cssClass: 'secondary',
        handler: () => {
          sample.destroy();
        },
      },
    ],
  });
}

const Record = observer(({ sample }) => {
  const date = new Date(sample.metadata.created_on);
  const prettyDate = date.toLocaleDateString();
  const occ = sample.occurrences.at(0);
  const species = occ && occ.get('taxon').english;

  const isSent = sample.metadata.server_on;
  const href =
    !isSent && !sample.remote.synchronising
      ? `/record/${sample.cid}/edit`
      : undefined;

  const externalHref =
    isSent && `${config.site_url}record/details?occurrence_id=${occ.id}`;

  return (
    <IonItemSliding>
      <ErrorMessage sample={sample} />
      <IonItem
        routerLink={href}
        href={externalHref}
        detailIcon={externalHref ? open : undefined}
      >
        <IonLabel>
          <h3>
            <b>{t(species)}</b>
          </h3>
          <h4>{prettyDate}</h4>
        </IonLabel>
        <OnlineStatus sample={sample} />
      </IonItem>
      <IonItemOptions side="end">
        <IonItemOption color="danger" onClick={() => deleteRecord(sample)}>
          {t('Delete')}
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
});

Record.propTypes = {
  sample: PropTypes.object.isRequired,
};

export default Record;
