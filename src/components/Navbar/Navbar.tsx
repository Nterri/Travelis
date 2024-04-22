import * as React from "react";
import { Button } from "../UI/Button/Button";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export interface INavbarProps {
  callback: () => void;
}
export const Navbar: React.FC<INavbarProps> = function ({ callback }) {
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.app.user);

  const goArticles = () => {
    callback();
    navigate("/articles");
  };

  const goTours = () => {
    callback();
    navigate("/tours");
  };

  const goChat = () => {
    callback();
    navigate("/profile/chat");
  };

  return (
    <div className="panel">
      <Button callback={goArticles}>Статьи</Button>
      <Button callback={goTours}>Туры</Button>
      {!!user && user.id && (
        <>
          <Button callback={goChat} className="sign-in-block">
            Чат
          </Button>
        </>
      )}
    </div>
  );
};
