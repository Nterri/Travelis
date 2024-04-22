// @ts-ignore
import CryptoJS from "crypto-js";

const secretPass = "0.faic9386hor0.hjdxpftb4do0.bu4a4fvcxxc0.izvgz48i21";

export const encodeInfo = (text: string) =>
  CryptoJS.AES.encrypt(JSON.stringify(text), secretPass).toString();

export const decodeInfo = (text: string) =>
  JSON.parse(
    CryptoJS.AES.decrypt(text, secretPass).toString(CryptoJS.enc.Utf8),
  );
