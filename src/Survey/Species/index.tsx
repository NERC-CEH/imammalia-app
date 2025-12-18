import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import Main, { Species } from 'common/Components/SpeciesList';
import appModel from 'models/app';
import samples from 'models/collections/samples';
import Sample from 'models/sample';
import userModel from 'models/user';

type Props = {
  sample: Sample;
};
const SpeciesSelect = ({ sample }: Props) => {
  const { goBack } = useContext(NavContext);

  function onSelect(sp: Species) {
    sample.occurrences[0].data.taxon = sp; // eslint-disable-line
    sample.save();

    goBack();
  }

  return (
    <Page id="species-attr">
      <Header title="Species" />
      <Main
        appModel={appModel}
        samples={samples}
        onSpeciesClick={onSelect}
        userModel={userModel}
      />
    </Page>
  );
};

export default observer(SpeciesSelect);
