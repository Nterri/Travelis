import * as React from "react";
import { useState } from "react";
import "./style.scss";
import {
  defaultInputValue,
  Input,
  InputType,
  InputTypeEnum,
} from "../../UI/Input/Input";
import { Button } from "../../UI/Button/Button";
import {
  emailRegExp,
  validate,
  validateAll,
} from "../../../services/validation";
import { setLoadApp, setUserApp } from "../../../redux/app";
import { useDispatch } from "react-redux";
import { signInAPI } from "../../../api/auth";
import { errorToast, successToast } from "../../../services/toast";
import { encodeInfo } from "../../../services/code";
import { DateNow } from "../../../services/time";
import { StorageType, timeCookie } from "../../../services/storage";
import { useCookies } from "react-cookie";

export interface IFormAuthProps {
  changeModals: () => void;
  toggleModal: () => void;
}
export const FormAuth: React.FC<IFormAuthProps> = function ({
  changeModals,
  toggleModal,
}) {
  const dispatch = useDispatch();

  const [_, setCookie] = useCookies([StorageType.TOKEN]);

  const setCookieTokenFunction = (data: string) => {
    let expires = DateNow;
    expires.setTime(expires.getTime() + timeCookie);
    setCookie(StorageType.TOKEN, data, { path: "/", expires });
  };

  const [email, setEmail] = useState<InputType>(defaultInputValue);
  const [pass, setPass] = useState<InputType>(defaultInputValue);

  const submit = () => {
    if (
      validateAll([
        {
          value: email.value,
          setValue: setEmail,
          regExp: emailRegExp,
        },
        {
          value: pass.value,
          setValue: setPass,
        },
      ])
    ) {
      dispatch(setLoadApp(true));
      signInAPI({
        email: email.value,
        password: pass.value,
      })
        .then((result) => {
          if (result.status) {
            successToast(result.message);
            toggleModal();
            dispatch(setUserApp(result.result));
            setCookieTokenFunction(
              encodeInfo(
                JSON.stringify({
                  email: result.result.email,
                  pass: result.result.password,
                }),
              ),
            );
          } else {
            errorToast(result.message);
            setEmail(defaultInputValue);
            setPass(defaultInputValue);
          }
        })
        .catch(() => errorToast("Ошибка авторизации! Попробуйте ещё раз!"))
        .finally(() => {
          dispatch(setLoadApp(false));
        });
    }
  };

  return (
    <div className="block-content">
      <div className="form-auth">
        <div className="form-auth__item">
          <Input
            label={"Почта"}
            required
            value={email.value}
            error={email.error}
            success={email.success}
            onChange={(value) =>
              validate({
                value: value,
                setValue: setEmail,
                regExp: emailRegExp,
              })
            }
          />
        </div>
        <div className="form-auth__item">
          <Input
            label={"Пароль"}
            required
            showSuccess={false}
            value={pass.value}
            error={pass.error}
            success={pass.success}
            type={InputTypeEnum.PASSWORD}
            onChange={(value) => validate({ value, setValue: setPass })}
          />
        </div>
        <Button callback={submit} className="sign">
          Войти
        </Button>
      </div>
      <Button callback={changeModals} className="change">
        Регистрация
      </Button>
    </div>
  );
};
