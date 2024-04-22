import { toast } from "react-toastify";

export const infoToast = (text: string) => toast.info(text);
export const successToast = (text: string) => toast.success(text);
export const warnToast = (text: string) => toast.warn(text);
export const errorToast = (text: string) => toast.error(text);
