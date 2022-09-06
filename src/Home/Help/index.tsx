import { Page, Main, Collapse } from '@flumens';
import { Trans as T } from 'react-i18next';
import { IonList, IonItemDivider, IonIcon } from '@ionic/react';
import { settings, arrowUndo, person, add } from 'ionicons/icons';
import './styles.scss';

const Help = () => (
  <Page id="help">
    <Main>
      <IonList lines="none">
        <IonItemDivider>
          <T>Records</T>
        </IonItemDivider>
        <div className="rounded">
          <Collapse title="How to start a record">
            <p>
              <T>To start a new record you can press the plus button</T>
              <IonIcon icon={add} />
              <T>in the home page footer.</T>
              <br />
              <br />
              <T>
                When finished, set for submission by pressing the Finish button
                in the header.
              </T>
            </p>
          </Collapse>

          <Collapse title="Sync. with the website">
            <p>
              <T>All your saved records will be shown on your account page.</T>{' '}
              <IonIcon icon={person} />
              <br />
              <br />
              <a href="https://european-mammals.brc.ac.uk">
                https://european-mammals.brc.ac.uk
              </a>
              <br />
              <br />
              <T>
                By default a record is in a 'draft' mode which will not be sent
                to the database until the 'Finish' button in the header is
                clicked. The application will try to submit your record once
                there is a good network connection.
              </T>
              <br />
              <br />
              <b>
                <T>Note</T>:
              </b>{' '}
              <T>
                you have to be signed in to your website account and have a
                network connection, for the records to be automatically
                synchronised in the background
              </T>
              .
              <br />
            </p>
          </Collapse>
          <Collapse title="Delete a record">
            <p>
              <T>
                To delete a record, swipe it left in your account page and click
                the delete button.
              </T>
            </p>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>User</T>
        </IonItemDivider>
        <div className="rounded">
          <Collapse title="Sign in/out or register">
            <p>
              <T>
                To login, open the main menu page click Login or Register
                buttons and follow the instructions.
              </T>
              <br />
              <br />
              <T>
                To logout, visit the main menu page and click the logout button.
              </T>
              <br />
              <br />
              <b>
                <T>Note</T>:
              </b>{' '}
              <T>
                after registering a new account you must verify your email
                address by clicking on a verification link sent to your email
              </T>
              .
            </p>
          </Collapse>
        </div>

        <IonItemDivider>
          <T>Other</T>
        </IonItemDivider>
        <div className="rounded">
          <Collapse title="Reset the application">
            <p>
              <T>Go to the application settings page</T>{' '}
              <IonIcon icon={settings} /> <T>and click on the Reset</T>{' '}
              <IonIcon icon={arrowUndo} />
              <T>button</T>.
            </p>
          </Collapse>
        </div>
      </IonList>
    </Main>
  </Page>
);

export default Help;
