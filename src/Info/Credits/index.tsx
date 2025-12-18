import { Trans as T } from 'react-i18next';
import { Page, Header, Main, Section } from '@flumens';
import { IonItem, IonLabel } from '@ionic/react';
import species, { Species } from 'common/data/species';
import appModel from 'models/app';
import './styles.scss';

const { P, H } = Section;

const getPhotoAttribution = () => {
  const getPhotoAttributionEntry = (s: Species) => {
    if (!s.photoAttribution) return null;

    return (
      <IonItem key={s.id} lines="none">
        <IonLabel>
          <i>{`${s.taxon}: `}</i>
          <span dangerouslySetInnerHTML={{ __html: s.photoAttribution }} />
        </IonLabel>
      </IonItem>
    );
  };
  return species.map(getPhotoAttributionEntry);
};

const Credits = () => {
  const { language } = appModel.data;
  const showKarolina = !['mk_MK', 'sr_RS'].includes(language);
  const showDominika = ['sk_SK'].includes(language);
  const showKatrine = ['no_NO'].includes(language);
  const showJobardAndWaller = ['fr_FR'].includes(language);

  return (
    <Page id="credits">
      <Header title="Credits" />
      <Main>
        <Section>
          <P>This App was produced through MammalNet and funded by EFSA.</P>
          <P skipTranslation>
            {' '}
            <T>Maps produced</T> © Societas Europaea Mammalogica 2019
          </P>

          <P skipTranslation>
            <T>Icons made by</T>{' '}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>{' '}
            <T>from</T>{' '}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </P>
        </Section>

        <Section>
          <H>
            We are very grateful for all the people that helped to create this
            app:
          </H>
          <P skipTranslation>David Roy</P>
          <P skipTranslation>Karolis Kazlauskis</P>
          <P skipTranslation>Graham Smith</P>
          <P skipTranslation>Joaquin Vicente</P>
          <P skipTranslation>Jose A Blanco</P>
          <P skipTranslation>Oliver Keuling</P>
          {showKarolina && <P skipTranslation>Karolina Petrović</P>}
          {showDominika && <P skipTranslation>Dominika Králiková</P>}
          {showKatrine && <P skipTranslation>Katrine Eldegard</P>}
          {showJobardAndWaller && <P skipTranslation>Laurène Jobard</P>}
          {showJobardAndWaller && <P skipTranslation>Elisabeth Waller</P>}
          <P skipTranslation>Massimo Scandura</P>
          <P skipTranslation>Nikica Šprem</P>
          <P skipTranslation>Nera Fabijanić</P>
          <P skipTranslation>Carmen Ruiz</P>
          <P skipTranslation>Javier Fernández López</P>
          <P skipTranslation>Phil Stephens</P>
          <P skipTranslation>Lucy Zhang</P>
          <P skipTranslation>Sammy Mason</P>
          <P skipTranslation>Emily Townley </P>
          <P skipTranslation>Magnus Bower</P>
          <P skipTranslation>Tomasz Borowik</P>
          <P skipTranslation>Milan Pandurovic</P>
          <P skipTranslation>Majlind Sulçe</P>
          <P skipTranslation>George Mitsainas</P>
          <P skipTranslation>Uliana de Castro</P>
          <P skipTranslation>João P.V. Santos</P>
        </Section>

        <Section>
          <H>Photo credits:</H>
          <P skipTranslation>{getPhotoAttribution()}</P>
        </Section>
      </Main>
    </Page>
  );
};

export default Credits;
