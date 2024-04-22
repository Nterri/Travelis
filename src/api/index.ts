import axios, { AxiosResponse } from "axios";

/**
 * Тип ответа от сервера
 */
export type Response<T = any> = AxiosResponse<{
  status: string;
  data: T;
}>;

export type DefaultResponse<T = string> = {
  status: boolean;
  result: T;
  message: string;
};

export const backUrl = "http://localhost/api/";

const api = axios.create({
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "*/*",
  },
  withCredentials: true,
});

export default api;
