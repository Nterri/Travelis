import { InputType } from "../components/UI/Input/Input";
import { Dispatch, SetStateAction } from "react";

export const emailRegExp = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
export const passRegExp =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
export const spaceRegExp = /^[ \s]+|[ \s]+$/g;
export const numberRegExp = /^\d+$/;

export type ValidateParamsType<T = string> = {
  value: T;
  setValue: Dispatch<SetStateAction<InputType<T>>>;
  regExp?: RegExp;
  minLength?: number;
};

export const validate = <T = string>({
  value,
  setValue,
  regExp,
  minLength = 6,
}: ValidateParamsType<T>): boolean => {
  let valid = true;
  if (typeof value === "string" && value === "") {
    valid = false;
  }
  if (typeof value === "string" && value.length < minLength) {
    valid = false;
  }
  if (typeof value === "string" && regExp) {
    valid = regExp.test(value);
  }
  setValue({ value, error: !valid, success: valid });
  return valid;
};

export const validateAll = (array: Array<ValidateParamsType>) => {
  return !array.map((field) => validate(field)).filter((valid) => !valid)
    .length;
};
