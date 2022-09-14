import {
  DrupalUserModel,
  DrupalUserModelAttrs,
  useToast,
  useLoader,
} from '@flumens';
import * as Yup from 'yup';
import CONFIG from 'common/config/config';
import CONFIG1 from 'common/config';
import axios, { AxiosRequestConfig } from 'axios';
import { genericStore } from './store';

// const parseServerError = (e: AxiosError<{ message?: string }>) => {
//   if (e.response && e.response.data && e.response.data.message) {
//     if (e.response.data.message.includes('is already taken')) {
//       throw new Error('This email is already taken.');
//     }
//     if (e.response.data.message === 'The user credentials were incorrect.') {
//       throw new Error('Incorrect password or email');
//     }
//     if (e.response.data.message === 'Unrecognized username or email address.') {
//       throw new Error('Unrecognized email address.');
//     }
//     // catches also one where email is embedded
//     if (e.response.data.message.includes('not been activated')) {
//       throw new Error('The user has not been activated or is blocked.');
//     }
//     throw new Error(e.response.data.message);
//   }

//   throw e;
// };

export interface Attrs extends DrupalUserModelAttrs {
  firstname?: string;
  lastname?: string;
  secondname: string;
  email?: string;

  /**
   * @deprecated
   */
  password?: any;
}

const defaults: Attrs = {
  // isLoggedIn: false,
  // drupalID: null,
  // name: null,
  // firstname: null,
  // secondname: null,
  // email: null,
  // password: null,

  firstname: '',
  secondname: '',
  email: '',
};

export class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  loginSchema = Yup.object().shape({
    email: Yup.string().required(),
    password: Yup.string().required(),
  });

  loginSchemaBackend = Yup.object().shape({
    id: Yup.number().required(),
    email: Yup.string().email().required(),
    name: Yup.string().required(),
  });

  resetSchema = Yup.object().shape({
    email: Yup.string().required(),
  });

  resetSchemaBackend = Yup.object().shape({
    data: Yup.object().shape({
      id: Yup.number().required(),
      firstname: Yup.string().required(),
      secondname: Yup.string().required(),
      type: Yup.string().required(),
    }),
  });

  registerSchema = Yup.object().shape({
    email: Yup.string().email('email is not valid').required(),
    firstname: Yup.string().required(),
    secondname: Yup.string().required(),
    password: Yup.string().required(),
    terms: Yup.boolean()
      .oneOf([true], 'must accept terms and conditions')
      .required(),
  });

  registerSchemaBackend = Yup.object().shape({
    id: Yup.number().required(),
    warehouse_id: Yup.number().required(),
    email: Yup.string().email().required(),
    name: Yup.string().required(),
    firstname: Yup.string().required(),
    secondname: Yup.string().required(),
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

  // async _exchangePasswordToTokens(email: string, password: string) {
  //   const formdata = new FormData();
  //   formdata.append('grant_type', 'password');
  //   formdata.append('username', email);
  //   formdata.append('password', password);
  //   // formdata.append('client_id', this.config.clientId);
  //   // this.config.clientPass &&
  //   //   formdata.append('client_secret', this.config.clientPass);
  //   // this.config.scopes?.length &&
  //   //   formdata.append('scope', this.config.scopes.join(' ')); // key name is singular

  //   const options: AxiosRequestConfig = {
  //     method: 'post',
  //     url: `https://european-mammals.brc.ac.uk/api/v1/users/${encodeURIComponent(
  //       email
  //     )}`,
  //     data: formdata,
  //   };

  //   console.log(options.url);

  //   const { data } = await axios(options).catch(parseServerError);
  //   return data;
  // }

  // async logIn(email: string, password: string) {
  //   const tokens = await this._exchangePasswordToTokens(email, password);

  //   this.attrs.tokens = tokens;
  //   await this.refreshProfile();
  //   return this.save();
  // }

  async logIn1(email: any, password: any) {
    // Log('User: logging in.');

    const userAuth = btoa(`${email}:${password}`);
    console.log(CONFIG.indicia.api_key, email, password, userAuth);

    const url = CONFIG.users.url + encodeURIComponent(email);
    const options: AxiosRequestConfig = {
      method: 'get',
      headers: {
        authorization: `Basic ${userAuth}`,
        'x-api-key': CONFIG.indicia.api_key as string,
        'content-type': 'application/json',
      },
      url,
    };

    let res: any;
    try {
      res = await axios(options);
      const isValidResponse = await this.loginSchemaBackend.isValid(res.data);
      if (!isValidResponse) {
        throw new Error('Invalid backend response.');
      }
    } catch (e) {
      // throw new Error(t(e.message));
      console.log('her');
    }

    const user = { ...res.data, ...{ password } };
    console.log('res', user);
    this._logIn(user);
  }

  _logIn(user: any) {
    // this.attrs.drupalID = user.id || '';
    this.attrs.password = user.password || '';
    this.attrs.email = user.email || '';
    // this.attrs.name = user.name || '';
    this.attrs.firstname = user.firstname || '';
    this.attrs.secondname = user.secondname || '';
    // this.attrs.isLoggedIn = true;

    return this.save();
  }
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG1.backend,
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
