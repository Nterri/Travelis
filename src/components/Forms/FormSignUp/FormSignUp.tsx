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
  passRegExp,
  validate,
  validateAll,
} from "../../../services/validation";
import { useDispatch } from "react-redux";
import { setLoadApp, setUserApp } from "../../../redux/app";
import { signInAPI, signUpAPI } from "../../../api/auth";
import { errorToast, successToast } from "../../../services/toast";
import { encodeInfo } from "../../../services/code";
import { useCookies } from "react-cookie";
import { StorageType, timeCookie } from "../../../services/storage";
import { DateNow } from "../../../services/time";

export interface IFormSignUpProps {
  changeModals: () => void;
  toggleModal: () => void;
}
export const FormSignUp: React.FC<IFormSignUpProps> = function ({
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
  const [lastName, setLastName] = useState<InputType>(defaultInputValue);
  const [firstName, setFirstName] = useState<InputType>(defaultInputValue);
  const [patronymic, setPatronymic] = useState<InputType>(defaultInputValue);
  const [passOne, setPassOne] = useState<InputType>(defaultInputValue);
  const [passTwo, setPassTwo] = useState<InputType>(defaultInputValue);

  const [step, setStep] = useState<number>(1);

  const submit = () => {
    switch (step) {
      case 1: {
        if (
          validateAll([
            {
              value: email.value,
              setValue: setEmail,
              regExp: emailRegExp,
            },
          ])
        ) {
          setStep(step + 1);
        }
        break;
      }
      case 2: {
        if (
          validateAll(
            !!patronymic.value
              ? [
                  { value: lastName.value, setValue: setLastName },
                  { value: firstName.value, setValue: setFirstName },
                  { value: patronymic.value, setValue: setPatronymic },
                ]
              : [
                  { value: lastName.value, setValue: setLastName },
                  { value: firstName.value, setValue: setFirstName },
                ],
          )
        ) {
          setStep(step + 1);
        }
        break;
      }
      case 3: {
        if (
          validateAll([
            {
              value: passOne.value,
              setValue: setPassOne,
              regExp: passRegExp,
            },
            {
              value: passTwo.value,
              setValue: setPassTwo,
              regExp: passRegExp,
            },
          ])
        ) {
          if (passOne.value === passTwo.value) {
            dispatch(setLoadApp(true));
            signUpAPI({
              email: email.value,
              lastName: lastName.value,
              firstName: firstName.value,
              patronymic: patronymic.value,
              password: passOne.value,
            })
              .then((result) => {
                if (result.status) {
                  successToast(result.message);
                  toggleModal();
                  signInAPI({
                    email: email.value,
                    password: passOne.value,
                  }).then((result) => {
                    if (result.status) {
                      dispatch(setUserApp(result.result));
                      setCookieTokenFunction(
                        encodeInfo(
                          JSON.stringify({
                            email: result.result.email,
                            pass: result.result.password,
                          }),
                        ),
                      );
                    }
                  });
                } else {
                  errorToast(result.message);
                  setStep(1);
                }
              })
              .catch(() => errorToast("Ошибка регистрации! Попробуйте снова!"))
              .finally(() => {
                dispatch(setLoadApp(false));
              });
          } else {
            setPassOne({ ...passOne, success: false, error: true });
            setPassTwo({ ...passTwo, success: false, error: true });
            errorToast("Пароли не совпадают!");
          }
        }
        break;
      }
    }
  };

  return (
    <div className="block-content block-signup">
      <div className="form-registration">
        <div
          className={"form-registration__item " + (step === 1 ? "active" : "")}
        >
          <Input
            label={"Почта"}
            labelAfter={"будет использоваться при авторизации"}
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
          <Button callback={submit} className="next">
            Далее
          </Button>
        </div>
        <div
          className={"form-registration__item " + (step === 2 ? "active" : "")}
        >
          <Input
            label={"Фамилия"}
            required
            value={lastName.value}
            error={lastName.error}
            success={lastName.success}
            onChange={(value) => validate({ value, setValue: setLastName })}
          />
          <Input
            label={"Имя"}
            required
            value={firstName.value}
            error={firstName.error}
            success={firstName.success}
            onChange={(value) => validate({ value, setValue: setFirstName })}
          />
          <Input
            label={"Отчество"}
            value={patronymic.value}
            error={patronymic.error}
            success={patronymic.success}
            onChange={(value) => validate({ value, setValue: setPatronymic })}
          />
          <Button callback={submit} className="next">
            Далее
          </Button>
        </div>
        <div
          className={"form-registration__item " + (step === 3 ? "active" : "")}
        >
          <Input
            label={"Пароль"}
            labelAfter={
              "больше 8 цифр, включая буквы, цифры и специальные знаки"
            }
            required
            value={passOne.value}
            error={passOne.error}
            success={passOne.success}
            type={InputTypeEnum.PASSWORD}
            onChange={(value) =>
              validate({ value, setValue: setPassOne, regExp: passRegExp })
            }
          />
          <Input
            label={"Повторите пароль"}
            labelAfter={
              "больше 8 цифр, включая буквы, цифры и специальные знаки"
            }
            required
            value={passTwo.value}
            error={passTwo.error}
            success={passTwo.success}
            type={InputTypeEnum.PASSWORD}
            onChange={(value) =>
              validate({ value, setValue: setPassTwo, regExp: passRegExp })
            }
          />
          <Button callback={submit} className="next">
            Регистрация
          </Button>
        </div>
      </div>
      <Button callback={changeModals} className="change">
        Авторизация
      </Button>
    </div>
  );
};
