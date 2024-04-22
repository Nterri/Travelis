import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";
import { articleMapping, userMapping } from "../services/mapping";
import { UsersType } from "./auth";

export type UpdateUserParams = {
  id: number | undefined;
  block: number;
  role: string;
};

export type CreateTourParams = {
  name: string;
  image: string;
  description: string;
  city: string;
  dateStart: number;
  dateEnd: number;
  price: number;
};

export function getAllUserAPI() {
  return api
    .post(backUrl, {
      action: "getAllUser",
    })
    .then((response: AxiosResponse<DefaultResponse<Array<UsersType>>>) => ({
      ...response.data,
      result: [...response.data.result].map((user) => userMapping(user)),
    }));
}

export function updateUserAPI(data: UpdateUserParams) {
  return api
    .post(backUrl, {
      ...data,
      action: "updateUser",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function getReviewArticlesAPI() {
  return api
    .post(backUrl, {
      action: "getReviewArticles",
    })
    .then((response: AxiosResponse<DefaultResponse<Array<any>>>) => ({
      ...response.data,
      result: articleMapping(response.data.result),
    }));
}

export function acceptArticleAPI(data: { id: number | undefined }) {
  return api
    .post(backUrl, {
      ...data,
      action: "acceptArticle",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function deleteSubjectAPI(data: { id: number | undefined }) {
  return api
    .post(backUrl, {
      ...data,
      action: "deleteSubject",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function addSubjectAPI(data: { name: string }) {
  return api
    .post(backUrl, {
      ...data,
      action: "addSubject",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function hideArticleAPI(data: { id: number | undefined; text: string }) {
  return api
    .post(backUrl, {
      ...data,
      action: "hideArticle",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function hideCommentAPI(data: { id: number | undefined }) {
  return api
    .post(backUrl, {
      ...data,
      action: "hideComment",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function createTourAPI(data: CreateTourParams) {
  return api
    .post(backUrl, {
      ...data,
      action: "createTour",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function unSignUserAPI(data: {
  idUser: number | undefined;
  idTour: string | undefined;
}) {
  return api
    .post(backUrl, {
      ...data,
      action: "unSignUser",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}
