import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";

export type LikeArticleParams = {
  idArticle: number | undefined;
  idUser: number | undefined;
  like: number;
  increment: boolean;
};

export type LikeTourParams = {
  idTour: number | undefined;
  idUser: number | undefined;
  like: number;
  increment: boolean;
};

export type LikeCommentParams = {
  idComment: number | undefined;
  idUser: number | undefined;
  like: number;
  increment: boolean;
};

export function likeArticleAPI(data: LikeArticleParams) {
  return api
    .post(backUrl, { ...data, action: "likeArticle" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function likeTourAPI(data: LikeTourParams) {
  return api
    .post(backUrl, { ...data, action: "likeTour" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function likeCommentAPI(data: LikeCommentParams) {
  return api
    .post(backUrl, { ...data, action: "likeComment" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}
