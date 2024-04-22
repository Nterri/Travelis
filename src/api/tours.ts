import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";
import { ArticleParamType } from "../screens/Articles/ArticleConstructScreen";
import { articleMapping, tourMapping, userMapping } from "../services/mapping";
import { CommentType } from "./comments";

export type TourType = {
  id: number;
  name: string;
  image: string;
  description: string;
  city: string;
  dateStart: number;
  dateEnd: number;
  price: number;
  likes: number;
  comments: Array<CommentType>;
  likesUser: Array<number>;
  signUser: Array<number>;
};

export function getToursAPI() {
  return api
    .post(backUrl, {
      action: "getTours",
    })
    .then((response: AxiosResponse<DefaultResponse<Array<any>>>) => ({
      ...response.data,
      result: tourMapping(response.data.result),
    }));
}

export function signTourApi(data: {
  idTour: number;
  idUser: number;
  isSet: boolean;
}) {
  return api
    .post(backUrl, { ...data, action: "signTour" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => ({
      ...response.data,
      result: userMapping(response.data.result),
    }));
}
