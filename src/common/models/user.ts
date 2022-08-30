import { DrupalUserModel, DrupalUserModelAttrs } from '@flumens';
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
  // isLoggedIn: false,
  // drupalID: null,
  // name: null,
  // firstname: null,
  // secondname: null,
  // email: null,
  // password: null,

  firstName: '',
  lastName: '',
  email: '',
};

export class UserModel extends DrupalUserModel {
  attrs: Attrs = DrupalUserModel.extendAttrs(this.attrs, defaults);

  loginSchema = Yup.object().shape({
    name: Yup.string().required(),
    password: Yup.string().required(),
  });

  loginSchemaBackend = Yup.object().shape({
    id: Yup.number().required(),
    email: Yup.string().email().required(),
    name: Yup.string().required(),
  });

  resetSchema = Yup.object().shape({
    name: Yup.string().required(),
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
}

const userModel = new UserModel({
  cid: 'user',
  store: genericStore,
  config: CONFIG.backend,
});

export default userModel;
