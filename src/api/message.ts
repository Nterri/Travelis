import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";
import { messageMapping } from "../services/mapping";

export type SendMessageParams = {
  idFrom: number | undefined;
  idTo: number | undefined;
  text: string;
};

export function sendMessageAPI(data: SendMessageParams) {
  return api
    .post(backUrl, { ...data, action: "sendMessage" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}

export function getMessageAPI() {
  return api
    .post(backUrl, { action: "getMessage" })
    .then((response: AxiosResponse<DefaultResponse<any>>) => ({
      ...response.data,
      result: messageMapping(response.data.result),
    }));
}
