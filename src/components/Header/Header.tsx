import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { Button } from "../UI/Button/Button";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Modal } from "../UI/Modal/Modal";
import { FormAuth } from "../Forms/FormAuth/FormAuth";
import { FormSignUp } from "../Forms/FormSignUp/FormSignUp";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setUserApp } from "../../redux/app";
import { useCookies } from "react-cookie";
import { StorageType, timeCookie } from "../../services/storage";
import { DateNow } from "../../services/time";
import { successToast } from "../../services/toast";
import { RolesUser } from "../../api/auth";

export interface IHeaderProps {}
export const Header: React.FC<IHeaderProps> = function ({}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [_, setCookie] = useCookies([StorageType.TOKEN]);

  const setCookieTokenFunction = (data: string) => {
    let expires = DateNow;
    expires.setTime(expires.getTime() + timeCookie);
    setCookie(StorageType.TOKEN, data, { path: "/", expires });
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [authModalVisible, setAuthModalVisible] = useState<boolean>(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.app.user);

  const goProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const exit = () => {
    setIsOpen(false);
    dispatch(setUserApp(undefined));
    setCookieTokenFunction("");
    successToast("Вы успешно вышли из аккаунта!");
    navigate("/");
  };

  const changeModals = () => {
    if (authModalVisible) {
      setAuthModalVisible(false);
      setTimeout(() => setSignUpModalVisible(true), 300);
    }
    if (signUpModalVisible) {
      setSignUpModalVisible(false);
      setTimeout(() => setAuthModalVisible(true), 300);
    }
  };

  const scrollWidth = window.innerWidth - document.documentElement.clientWidth;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "visible";
    document.body.style.paddingRight = isOpen ? `${scrollWidth}px` : "0px";
  }, [isOpen]);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      setIsOpen(false);
    }
  });

  return (
    <div className="header">
      <div className="title-header">
        <Link
          to={"/"}
          onClick={() => setIsOpen(false)}
          className={isOpen ? "title-header-hide active" : "title-header-hide"}
        >
          <div className="title">
            Travelis <span>{user?.role === RolesUser.ADMIN && "Admin"}</span>
          </div>
        </Link>
        <div
          className={isOpen ? "burger open" : "burger"}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div
        className={isOpen ? "container open" : "container"}
        style={
          window.innerWidth <= 992
            ? {
                top:
                  document.querySelector(".title-header")?.clientHeight ?? 40,
              }
            : {}
        }
      >
        <Link to={"/"} onClick={() => setIsOpen(false)}>
          <div
            className="title"
            style={
              window.innerWidth > 992
                ? {
                    width:
                      document.querySelector(".button-panel")?.clientWidth ??
                      100,
                  }
                : {}
            }
          >
            Travelis <span>{user?.role === RolesUser.ADMIN && "Admin"}</span>
          </div>
        </Link>
        <Navbar callback={() => setIsOpen(false)} />
        <div className="button-panel">
          {!!user && user.id ? (
            <>
              <Button callback={goProfile} className="sign-in-block">
                Личный кабинет
              </Button>
              <Button callback={exit} className="sign-in-block">
                Выход
              </Button>
            </>
          ) : (
            <>
              <Button
                callback={() => {
                  setIsOpen(false);
                  setAuthModalVisible(!authModalVisible);
                }}
                className="sign-in-block"
              >
                Войти
              </Button>
              <Button
                callback={() => {
                  setIsOpen(false);
                  setSignUpModalVisible(!signUpModalVisible);
                }}
                className="sign-up-block"
              >
                Регистрация
              </Button>
            </>
          )}
        </div>
      </div>
      <Modal
        title={"Авторизация"}
        isVisible={authModalVisible}
        setIsVisible={(flag) => setAuthModalVisible(flag)}
      >
        {authModalVisible && (
          <FormAuth
            changeModals={changeModals}
            toggleModal={() => setAuthModalVisible(!authModalVisible)}
          />
        )}
      </Modal>
      <Modal
        title={"Регистрация"}
        isVisible={signUpModalVisible}
        setIsVisible={(flag) => setSignUpModalVisible(flag)}
      >
        {signUpModalVisible && (
          <FormSignUp
            changeModals={changeModals}
            toggleModal={() => setSignUpModalVisible(!signUpModalVisible)}
          />
        )}
      </Modal>
    </div>
  );
};
