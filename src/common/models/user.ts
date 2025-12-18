import { useContext } from 'react';
import { z, object } from 'zod';
import {
  DrupalUserModel,
  DrupalUserModelData,
  useToast,
  useAlert,
  useLoader,
  device,
} from '@flumens';
import { NavContext } from '@ionic/react';
import * as Sentry from '@sentry/browser';
import CONFIG from 'common/config';
import { mainStore } from './store';

export interface Data extends DrupalUserModelData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

const defaults: Data = {
  firstName: '',
  lastName: '',
  email: '',
};

export class UserModel extends DrupalUserModel<Data> {
  static registerSchema: any = object({
    email: z.string().email('Please fill in'),
    password: z.string().min(1, 'Please fill in'),
    firstName: z.string().min(1, 'Please fill in'),
    secondName: z.string().min(1, 'Please fill in'),
  });

  constructor(options: any) {
    super({ ...options, data: { ...defaults, ...options.data } });

    const checkForValidation = () => {
      if (this.isLoggedIn() && !this.data.verified) {
        console.log('User: refreshing profile for validation');
        this.refreshProfile();
      }
    };
    this.ready?.then(checkForValidation);
  }

  async logIn(email: string, password: string) {
    await super.logIn(email, password);

    if (this.id) Sentry.setUser({ id: this.id });
  }

  async checkActivation() {
    if (!this.isLoggedIn()) return false;

    if (!this.data.verified) {
      try {
        await this.refreshProfile();
      } catch (e) {
        // do nothing
      }

      if (!this.data.verified) return false;
    }

    return true;
  }

  async resendVerificationEmail() {
    if (!this.isLoggedIn() || this.data.verified) return false;

    await this._sendVerificationEmail();

    return true;
  }

  reset() {
    return super.reset(defaults);
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: mainStore,
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

    if (!userModel.data.verified) {
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
            },
            {
              text: 'Resend',
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
