import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { UsersType } from "../../api/auth";
import { Button } from "../UI/Button/Button";
import { setLoadApp } from "../../redux/app";
import { unSignUserAPI } from "../../api/admin";
import { errorToast, successToast } from "../../services/toast";
import { getDataArticles, getDataTours } from "../../screens/HomeScreen";

export interface ITourAdminProps {
  id: number;
  tourId: string | undefined;
}
export const TourAdmin: React.FC<ITourAdminProps> = function ({ id, tourId }) {
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.admin.users);
  const [currentUser, setCurrentUser] = useState<UsersType>();

  useEffect(() => {
    setCurrentUser(users.find((user) => user.id === id));
  }, [id, users]);

  const unSignUser = () => {
    dispatch(setLoadApp(true));
    unSignUserAPI({ idUser: currentUser?.id, idTour: tourId })
      .then((result) => {
        if (result.status) {
          successToast(result.message);
          getDataTours(dispatch);
        } else {
          errorToast(result.message);
        }
      })
      .finally(() => dispatch(setLoadApp(false)));
  };

  if (currentUser) {
    return (
      <div className="tour-content-admin">
        <div className="tour-content-admin__email">{currentUser.email}</div>
        <Button callback={unSignUser} className="tour-content-admin__delete">
          Отписать от тура
        </Button>
      </div>
    );
  } else {
    return <></>;
  }
};
