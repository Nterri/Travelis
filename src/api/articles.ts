import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";
import { ArticleParamType } from "../screens/Articles/ArticleConstructScreen";
import { articleMapping } from "../services/mapping";
import { CommentType } from "./comments";

export type ReportArticlesParams = {
  idArticle: number | undefined;
  idUser: number | undefined;
};

export type CreateArticlesParams = {
  nameArticle: string;
  arrayContent: Array<ArticleParamType>;
  arrayImage: Array<string>;
  subject: number | undefined;
  idUser: number | undefined;
};

export type ArticlesType = {
  id: number;
  name: string;
  content: Array<ArticleParamType>;
  subject: string;
  likes: number;
  enable: boolean;
  report: boolean;
  email: string;
  lastName: string;
  firstName: string;
  patronymic: string;
  comments: Array<CommentType>;
  likesUser: Array<number>;
  reasonReport: string;
};

export function getArticlesAPI() {
  return api
    .post(backUrl, {
      action: "getArticles",
    })
    .then((response: AxiosResponse<DefaultResponse<Array<any>>>) => ({
      ...response.data,
      result: articleMapping(response.data.result),
    }));
}

export function createArticlesAPI(data: CreateArticlesParams) {
  const JSONdata = {
    ...data,
    arrayContent: JSON.stringify(data.arrayContent),
    arrayImage: JSON.stringify(data.arrayImage),
  };
  return api
    .post(backUrl, { ...JSONdata, action: "createArticle" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function reportArticle(data: ReportArticlesParams) {
  return api
    .post(backUrl, { ...data, action: "reportArticle" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}
