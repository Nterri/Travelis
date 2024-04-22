import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";
import { userMapping } from "../services/mapping";

export type SignInParamsType = {
  email: string;
  password: string;
  noHash?: boolean;
};

export type SignUpParamsType = {
  email: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  password: string;
};

export enum RolesUser {
  USER = 1,
  ADMIN = 2,
}

export type UsersType = {
  id: number;
  email: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  password: string;
  block: boolean;
  role: RolesUser;
  tours: Array<number>;
};

export function signUpAPI(data: SignUpParamsType) {
  return api
    .post(backUrl, { ...data, action: "signUp" })
    .then((response: AxiosResponse<DefaultResponse>) => response.data);
}

export function signInAPI(data: SignInParamsType) {
  return api
    .post(backUrl, { ...data, action: "signIn" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => ({
      ...response.data,
      result: userMapping(response.data.result),
    }));
}
