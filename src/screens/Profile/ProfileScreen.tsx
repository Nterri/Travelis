import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { RolesUser } from "../../api/auth";
import { LoadData, LoadDataEnum } from "../../components/LoadData/LoadData";
import { setLoadUsers, setUsers } from "../../redux/admin";
import {
  addSubjectAPI,
  deleteSubjectAPI,
  getAllUserAPI,
} from "../../api/admin";
import { User } from "../../components/User/User";
import { Button } from "../../components/UI/Button/Button";
import { getSubjects } from "../Articles/ArticleConstructScreen";
import { setLoadApp } from "../../redux/app";
import { errorToast, successToast } from "../../services/toast";
import { Input } from "../../components/UI/Input/Input";
import { getDateByTime } from "../../services/time";
import { List } from "../../components/List/List";
import { TourType } from "../../api/tours";
import { Tour } from "../../components/Tour/Tour";
import { ReferenceType } from "../HomeScreen";

export const getUsers = (dispatch: AppDispatch) => {
  dispatch(setLoadUsers(LoadDataEnum.LOADING));
  getAllUserAPI()
    .then((result) => {
      dispatch(setLoadUsers(LoadDataEnum.LOADED));
      if (result.status) {
        dispatch(setUsers(result.result));
      }
    })
    .catch(() => {
      dispatch(setLoadUsers(LoadDataEnum.FAILED));
    });
};

export interface IToursScreenProps {}
export const ProfileScreen: React.FC<IToursScreenProps> = function ({}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.app.user);

  const loadingUsers = useSelector(
    (state: RootState) => state.admin.loadingUser,
  );
  const users = useSelector((state: RootState) => state.admin.users);

  const tours = useSelector((state: RootState) => state.tours.data);

  const subjects = useSelector((state: RootState) => state.subjects.data);
  const [field, setField] = useState<string>("");

  const isAdmin = !!user && user.role === RolesUser.ADMIN;

  const goHome = () => {
    navigate("/");
  };

  const goReview = () => {
    navigate("/profile/review");
  };

  const goAddTour = () => {
    navigate("/profile/tour/add");
  };

  const goTour = (id: number | undefined) => {
    navigate("/tours/" + id);
  };

  useEffect(() => {
    if (!user) goHome();
    getSubjects(dispatch);
  }, [user]);

  const deleteSubject = (id: number) => {
    dispatch(setLoadApp(true));
    deleteSubjectAPI({ id }).then((result) => {
      dispatch(setLoadApp(false));
      if (result.status) {
        successToast(result.message);
        getSubjects(dispatch);
      } else {
        errorToast(result.message);
      }
    });
  };

  const addSubject = () => {
    dispatch(setLoadApp(true));
    addSubjectAPI({ name: field }).then((result) => {
      dispatch(setLoadApp(false));
      if (result.status) {
        successToast(result.message);
        getSubjects(dispatch);
        setField("");
      } else {
        errorToast(result.message);
      }
    });
  };

  if (user)
    return (
      <>
        <div className="block-content profile">
          <div className="block-content__title">Данные пользователя</div>
          <div className="profile-content">
            <table className="profile-content__table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <td>Почта</td>
                  <td>
                    {user.email} <span>{isAdmin ? "Администратор" : ""}</span>
                  </td>
                </tr>
                <tr>
                  <td>Фамилия</td>
                  <td>{user.lastName}</td>
                </tr>
                <tr>
                  <td>Имя</td>
                  <td>{user.firstName}</td>
                </tr>
                <tr>
                  <td>Отчество</td>
                  <td>{user.patronymic}</td>
                </tr>
                <tr>
                  <td>Блокировка</td>
                  <td>{user.block ? "Заблокирован" : "Не заблокирован"}</td>
                </tr>
              </tbody>
            </table>
            {isAdmin ? (
              <div className="profile-content__admin-panel">
                <div className="block-content">
                  <LoadData
                    status={loadingUsers}
                    getData={() => getUsers(dispatch)}
                  >
                    <div className="block-content__title">Пользователи</div>
                    {users.length ? (
                      <div className="block-content__list">
                        <table className="user">
                          <thead>
                            <tr>
                              <td>ID</td>
                              <td>Почта</td>
                              <td>Фамилия</td>
                              <td>Имя</td>
                              <td>Отчество</td>
                              <td>Блокировка</td>
                              <td>Роль</td>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map((user) => (
                              <User key={user.id} user={user} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="block-content__list">
                        <div className="block-content__list-item__empty">
                          Данных пока нет, пытаемся найти...
                        </div>
                      </div>
                    )}
                  </LoadData>
                  <div className="block-content__title article-title">
                    Статьи
                  </div>
                  <Button
                    callback={goReview}
                    className="profile-content__admin-panel__btn"
                  >
                    На проверку
                  </Button>
                  <div className="block-content__title article-title">Туры</div>
                  <Button
                    callback={goAddTour}
                    className="profile-content__admin-panel__btn"
                  >
                    Добавить
                  </Button>
                  <div className="block-content__title">Тематики</div>
                  <div className="block-content__list">
                    {subjects.map((subject, index) => (
                      <div key={index} className="subject-block">
                        <div className="subject-block__name">
                          {subject.name}
                        </div>
                        <Button
                          callback={() => deleteSubject(subject.id)}
                          className="subject-block__name__btn"
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                    <div className="subjects-input">
                      <Input
                        label={"Тематика"}
                        value={field}
                        onChange={(value) => setField(value)}
                      />
                      <Button callback={addSubject} className="search">
                        Добавить
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tour-user">
                <div className="block-content__title article-title">
                  Ваши туры
                </div>
                <div className="profile-content__tour">
                  {!!user?.tours.length ? (
                    user?.tours.map((tour) => {
                      const currentTour = tours.find((t) => t.id === tour);
                      if (currentTour) {
                        return (
                          <div
                            className="profile-content__tour-item"
                            onClick={() => goTour(currentTour?.id)}
                          >
                            {currentTour?.name} (
                            {getDateByTime(currentTour?.dateStart)}-
                            {getDateByTime(currentTour?.dateEnd)})
                          </div>
                        );
                      } else return <></>;
                    })
                  ) : (
                    <div className="profile-content__tour-item">
                      Пока нет ничего!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );

  return <></>;
};
