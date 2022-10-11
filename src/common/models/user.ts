import { set as setMobXAttrs } from 'mobx';
import { useContext } from 'react';
import { NavContext } from '@ionic/react';
import {
  DrupalUserModel,
  DrupalUserModelAttrs,
  useToast,
  useAlert,
  useLoader,
  device,
} from '@flumens';
import * as Yup from 'yup';
import CONFIG from 'common/config';
import { genericStore } from './store';

export interface Attrs extends DrupalUserModelAttrs {
  firstName?: string;
  lastName?: string;
  email?: string;

  /**
   * @deprecated
   */
  password?: any;
}

const defaults: Attrs = {
  firstName: '',
  lastName: '',
  email: '',
};

export class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  registerSchema = Yup.object().shape({
    email: Yup.string().email('email is not valid').required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    password: Yup.string().required(),
  });

  constructor({ store, ...options }: any) {
    super(options);

    const checkForValidation = () => {
      if (this.isLoggedIn() && !this.attrs.verified) {
        console.log('User: refreshing profile for validation');
        this.refreshProfile();
      }
    };

    this._store = store;
    this.ready = this._fromOldStore();
    this.ready?.then(checkForValidation);
  }

  // backwards compatible convert old store document
  private async _fromOldStore(): Promise<boolean> {
    if (!this._store) return false;

    let document = await this._store.find(this.cid);

    if (!document) {
      await this.save(); // persisting for the first time
      return true;
    }

    const isOldTypeDocument = typeof document === 'string';
    if (isOldTypeDocument) {
      console.log('Converting old type document');
      document = JSON.parse(document);
    }

    if (document.id) this.id = document.id; // checking presence for backwards compatibility
    if (document.cid) this.cid = document.cid; // checking presence for backwards compatibility
    setMobXAttrs(this.attrs, document.attrs);
    setMobXAttrs(this.metadata, document.metadata);

    if (isOldTypeDocument) this.save();
    return true;
  }

  async getAccessToken(...args: any) {
    if (this.attrs.password) await this._migrateAuth();

    return super.getAccessToken(...args);
  }

  async resendVerificationEmail() {
    if (!this.isLoggedIn() || this.attrs.verified) return false;

    await this._sendVerificationEmail();

    return true;
  }

  resetDefaults() {
    return super.resetDefaults(defaults);
  }

  /**
   * Migrate from Indicia API auth to JWT. Remove in the future versions.
   */
  async _migrateAuth() {
    console.log('Migrating user auth.');
    if (!this.attrs.email) {
      // email might not exist
      delete this.attrs.password;
      return this.save();
    }

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const tokens = await this._exchangePasswordToTokens(
        this.attrs.email,
        this.attrs.password
      );
      this.attrs.tokens = tokens;
      delete this.attrs.password;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this._refreshAccessToken();
    } catch (e: any) {
      if (e.message === 'Incorrect password or email') {
        console.log('Removing invalid old user credentials');
        delete this.attrs.password;
        this.logOut();
      }
      console.error(e);
      throw e;
    }

    return this.save();
  }

  async checkActivation() {
    const isLoggedIn = !!this.attrs.email;
    if (!isLoggedIn) return false;

    if (!this.attrs.verified) {
      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      if (!this.attrs.verified) return false;
    }

    return true;
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG.backend,
});

export const useUserStatusCheck = () => {
  const { navigate } = useContext(NavContext);
  const toast = useToast();
  const loader = useLoader();
  const alert = useAlert();

  const check = async () => {
    if (!device.isOnline) {
      toast.warn('Looks like you are offline!');
      return false;
    }

    if (!userModel.isLoggedIn()) {
      navigate(`/user/login`);
      return false;
    }

    if (!userModel.attrs.verified) {
      await loader.show('Please wait...');
      const isVerified = await userModel.checkActivation();
      loader.hide();

      if (!isVerified) {
        const resendVerificationEmail = async () => {
          await loader.show('Please wait...');
          try {
            await userModel.resendVerificationEmail();
            toast.success(
              'A new verification email was successfully sent now. If you did not receive the email, then check your Spam or Junk email folders.'
            );
          } catch (err: any) {
            toast.error(err);
          }
          loader.hide();
        };

        alert({
          header: "Looks like your email hasn't been verified yet.",
          message: 'Should we resend the verification email?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
            },
            {
              text: 'Resend',
              cssClass: 'primary',
              handler: resendVerificationEmail,
            },
          ],
        });

        return false;
      }
    }

    return true;
  };

  return check;
};

export default userModel;
