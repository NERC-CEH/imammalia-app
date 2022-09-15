import { FC, useContext } from 'react';
import { NavContext } from '@ionic/react';
import { observer } from 'mobx-react';
import { Page, Main, Attr, Header, InfoMessage } from '@flumens';
import Occurrence from 'models/occurrence';

type Props = {
  occurrence: Occurrence;
};

const NumberAttr: FC<Props> = ({ occurrence }) => {
  const { goBack } = useContext(NavContext);
  const onSliderChange = (sliderValue: number) => {
    // eslint-disable-next-line no-param-reassign
    occurrence.attrs['number-ranges'] = undefined;

    // eslint-disable-next-line no-param-reassign
    occurrence.attrs.number = sliderValue;
    occurrence.save();
  };

  const onRadioChange = (rangesValue: string) => {
    // eslint-disable-next-line no-param-reassign
    occurrence.attrs.number = undefined;

    // eslint-disable-next-line no-param-reassign
    occurrence.attrs['number-ranges'] = rangesValue;
    occurrence.save();

    goBack();
  };

  const surveyConfig = occurrence.getSurvey();
  const { attrProps: attrPropsNumberRanges } =
    surveyConfig.attrs['number-ranges'].pageProps;

  const { attrProps: attrPropsNumber } = surveyConfig.attrs.number.pageProps;

  return (
    <Page id="number">
      <Header title="Number" />

      <Main>
        <InfoMessage>How many individuals of this type?</InfoMessage>

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
