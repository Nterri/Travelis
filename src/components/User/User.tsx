import * as React from "react";
import { RolesUser, UsersType } from "../../api/auth";
import "./style.scss";
import { useDispatch } from "react-redux";
import { updateUserAPI } from "../../api/admin";
import { setLoadApp } from "../../redux/app";
import { errorToast, successToast } from "../../services/toast";
import { getUsers } from "../../screens/Profile/ProfileScreen";

export interface IUserProps {
  user: UsersType;
}
export const User: React.FC<IUserProps> = function ({ user }) {
  const dispatch = useDispatch();
  const update = (block: number, role: string) => {
    dispatch(setLoadApp(true));
    updateUserAPI({ id: user.id, block, role }).then((result) => {
      dispatch(setLoadApp(false));
      if (result.status) {
        successToast(result.message);
        getUsers(dispatch);
      } else {
        errorToast(result.message);
      }
    });
  };

  return (
    <tr>
      <td>
        <span>ID:</span>
        {user.id}
      </td>
      <td>
        <span>Почта:</span>
        {user.email}
      </td>
      <td>
        <span>Фамилия:</span>
        {user.firstName}
      </td>
      <td>
        <span>Имя:</span>
        {user.lastName}
      </td>
      <td>
        <span>Отчество:</span>
        {user.patronymic}
      </td>
      <td>
        <span>Блокировка:</span>
        <select
          className="select"
          value={user.block ? 1 : 0}
          defaultValue={0}
          onChange={(event) => {
            update(Number(event.target.value), user.role.toString());
          }}
        >
          <option value={1} selected={user.block}>
            Да
          </option>
          <option value={0} selected={!user.block}>
            Нет
          </option>
        </select>
      </td>
      <td>
        <span>Роль:</span>
        <select
          className="select"
          value={user.role}
          defaultValue={user.role}
          onChange={(event) => {
            update(user.block ? 1 : 0, event.target.value);
          }}
        >
          <option
            value={RolesUser.USER}
            selected={user.role === RolesUser.USER}
          >
            Пользователь
          </option>
          <option
            value={RolesUser.ADMIN}
            selected={user.role === RolesUser.ADMIN}
          >
            Администратор
          </option>
        </select>
      </td>
    </tr>
  );
};
