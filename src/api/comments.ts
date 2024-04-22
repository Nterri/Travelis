import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";

export type CommentArticleParams = {
  idArticle: number | undefined;
  text: string;
  author: number | undefined;
};

export type CommentTourParams = {
  idTour: number | undefined;
  text: string;
  author: number | undefined;
};

export type CommentType = {
  id: number;
  text: string;
  time: string;
  likes: number;
  last_name: string;
  first_name: string;
  patronymic: string;
  email: string;
  likesUser: Array<number>;
};

export function createCommentArticleAPI(data: CommentArticleParams) {
  return api
    .post(backUrl, { ...data, action: "createCommentArticle" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function createCommentTourAPI(data: CommentTourParams) {
  return api
    .post(backUrl, { ...data, action: "createCommentTour" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}
