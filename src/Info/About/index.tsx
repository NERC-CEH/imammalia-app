import { Page, Header, Main, Section } from '@flumens';
import { Trans as T } from 'react-i18next';
import './styles.scss';

const { P, H } = Section;

const About = () => (
  <Page id="about">
    <Header title="About" />
    <Main>
      <Section>
        <P>
          The iMammalia App is designed to encourage recording of mammals in the
          wild. This version of the mobile application is set up to easily
          record mammals in any European country, but does not yet have all
          European languages included.
        </P>

        <P>
          Sightings can be recorded anywhere, with or without photos, and all
          records will be verified by experts and made available to help with
          mapping the distribution of European mammals. You can check and update
          your records online.
        </P>

        <P>
          iMammalia is designed to make mammal recording easy. Smaller mammals
          are currently only listed at the generic level since they are much
          harder to tell apart. Later versions will include more countries,
          languages and species subject to funding.
        </P>

        <P>
          Users must first register, and can then log into a web site to view
          and correct records. Choice of country can be reviewed in the
          settings.
        </P>

        <P skipTranslation>
          <a href="https://european-mammals.brc.ac.uk">
            https://european-mammals.brc.ac.uk
          </a>
        </P>
      </Section>

      <Section>
        <H>App Development</H>
        <P skipTranslation>
          <T>This app was hand crafted with love by</T>
          <a href="https://flumens.io" style={{ whiteSpace: 'nowrap' }}>
            {' '}
            Flumens.
          </a>{' '}
          <T>
            Agency specializing in building bespoke data oriented solutions.
          </T>{' '}
          <T>For suggestions and feedback please do not hesitate to</T>{' '}
          <a href="mailto:imammalia%40ceh.ac.uk?subject=iMammalia%20App">
            <T>contact us</T>
          </a>
          .
        </P>
      </Section>
    </Main>
  </Page>
);

export default About;
