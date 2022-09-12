import { FC, useContext } from 'react';
import { observer } from 'mobx-react';
import Sample from 'models/sample';
import appModel from 'models/app';
import savedSamples from 'models/savedSamples';
import { Page, Header } from '@flumens';
import { NavContext } from '@ionic/react';
import Main, { Species } from 'common/Components/SpeciesList';

type Props = {
  sample: Sample;
};
const SpeciesSelect: FC<Props> = ({ sample }) => {
  const { goBack } = useContext(NavContext);

  function onSelect(sp: Species) {
    sample.occurrences[0].attrs.taxon = sp; // eslint-disable-line
    sample.save();

    goBack();
  }

  return (
    <Page id="species-attr">
      <Header title="Species" />
      <Main
        appModel={appModel}
        savedSamples={savedSamples}
        onSpeciesClick={onSelect}
      />
    </Page>
  );
};

export default observer(SpeciesSelect);
