import { useContext } from 'react';
import { observer } from 'mobx-react';
import { Page, Main, Attr, Header, InfoMessage } from '@flumens';
import { NavContext } from '@ionic/react';
import Occurrence from 'models/occurrence';

type Props = {
  occurrence: Occurrence;
};

const NumberAttr = ({ occurrence }: Props) => {
  const { goBack } = useContext(NavContext);
  const onSliderChange = (sliderValue: number) => {
    // eslint-disable-next-line no-param-reassign
    occurrence.data['number-ranges'] = undefined;

    // eslint-disable-next-line no-param-reassign
    occurrence.data.number = sliderValue;
    occurrence.save();
  };

  const onRadioChange = (rangesValue: string) => {
    // eslint-disable-next-line no-param-reassign
    occurrence.data.number = undefined;

    // eslint-disable-next-line no-param-reassign
    occurrence.data['number-ranges'] = rangesValue;
    occurrence.save();

    goBack();
  };

  const surveyConfig: any = occurrence.getSurvey();
  const { attrProps: attrPropsNumberRanges } =
    surveyConfig.attrs!['number-ranges'].pageProps;

  const { attrProps: attrPropsNumber } = surveyConfig.attrs!.number.pageProps;

  return (
    <Page id="number">
      <Header title="Number" />

      <Main className="attr-page">
        <InfoMessage className="m-2">
          How many individuals of this type?
        </InfoMessage>

        <Attr
          attr="number"
          model={occurrence}
          {...attrPropsNumber}
          onChange={onSliderChange}
        />

        <Attr
          onChange={onRadioChange}
          attr="number-ranges"
          model={occurrence}
          {...attrPropsNumberRanges}
        />
      </Main>
    </Page>
  );
};

export default observer(NumberAttr);
