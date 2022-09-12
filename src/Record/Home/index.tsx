import { FC } from 'react';
import { Page, Header } from '@flumens';
import { observer } from 'mobx-react';
import Main from './Main';
import './styles.scss';

type Props = {
  sample: any;
};

const Home: FC<Props> = ({ sample }) => {
  console.log(sample);

  return (
    <Page id="survey-point-edit">
      <Header title="New Sighting" defaultHref="/home/surveys" />
      <Main sample={sample} />
    </Page>
  );
};

export default observer(Home);
