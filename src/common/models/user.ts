import {
  DrupalUserModel,
  DrupalUserModelAttrs,
  useToast,
  useLoader,
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

  constructor(options: any) {
    super(options);

    const checkForValidation = () => {
      if (this.isLoggedIn() && !this.attrs.verified) {
        console.log('User: refreshing profile for validation');
        this.refreshProfile();
      }
    };
    this.ready?.then(checkForValidation);
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
  const toast = useToast();
  const loader = useLoader();

  const userStatusAlert = async () => {
    if (!userModel.attrs.verified) {
      await loader.show('Please wait...');
      const isVerified = await userModel.checkActivation();
      loader.hide();

      if (!isVerified) {
        toast.warn('The user has not been activated or is blocked.');
        return false;
      }
    }

    return true;
  };
  return userStatusAlert;
};

export default userModel;
