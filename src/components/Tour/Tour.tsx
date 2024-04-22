import * as React from "react";
import "./style.scss";
import { Button } from "../UI/Button/Button";
import { useNavigate } from "react-router-dom";
import { ReferenceType } from "../../screens/HomeScreen";
import { backUrl } from "../../api";
import { getDateByTime } from "../../services/time";

export interface ITourProps {
  id: number;
  title: string;
  image: string;
  desc: string;
  dateStart: number;
  dateEnd: number;
  reference: ReferenceType;
}
export const Tour: React.FC<ITourProps> = function ({
  id,
  title,
  image,
  desc,
  dateStart,
  dateEnd,
  reference,
}) {
  const navigate = useNavigate();
  const goToTour = () => {
    navigate("/tours/" + id + "?reference=" + reference);
  };

  return (
    <div className="tour-content" onClick={goToTour}>
      <div className="tour-content__image">
        <img src={backUrl + image} alt="image" />
      </div>
      <div className="tour-content__title">{title}</div>
      <div className="tour-content__desc">{desc}</div>
      <div className="tour-content__date">
        {getDateByTime(dateStart)} - {getDateByTime(dateEnd)}
      </div>
      <Button callback={goToTour} className="tour-content__btn">
        Подробнее
      </Button>
    </div>
  );
};
