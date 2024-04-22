import api, { backUrl, DefaultResponse } from "./index";
import { AxiosResponse } from "axios";

export function getSubjectsAPI() {
  return api
    .post(backUrl, {
      action: "getSubjects",
    })
    .then((response: AxiosResponse<DefaultResponse<any>>) => response.data);
}
