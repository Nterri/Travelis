import * as React from "react";
import { useState } from "react";
import "./style.scss";
import { Input } from "../../UI/Input/Input";
import { Calendar, DateType } from "../../UI/Calendar/Calendar";
import { Button } from "../../UI/Button/Button";
import { infoToast } from "../../../services/toast";
import { useNavigate } from "react-router-dom";

export interface IFormTravelProps {}
export const FormTravel: React.FC<IFormTravelProps> = function ({}) {
  const navigate = useNavigate();
  const [city, setCity] = useState<string>("");
  const [date, setDate] = useState<DateType>({
    value: "",
    start: 0,
    end: 0,
  });

  const submit = () => {
    if (city && date.value) {
      navigate(
        "/tours?city=" + city + "&start=" + date.start + "&end=" + date.end,
      );
      setCity("");
      setDate({
        value: "",
        start: 0,
        end: 0,
      });
    } else {
      infoToast("Не заполнены поля!");
    }
  };

  return (
    <div className="block-content form-travel">
      <div className="block-content__title form-title">Найти путешествие</div>
      <div className="form-travel">
        <div className="form-travel__item">
          <Input
            label={"Город"}
            required
            value={city}
            onChange={(value) => setCity(value)}
          />
        </div>
        <div className="form-travel__item">
          <Calendar
            label={"Начало - конец"}
            value={date}
            required
            setValue={(value) => setDate(value)}
          />
        </div>
        <Button callback={submit} className="search">
          Найти
        </Button>
      </div>
    </div>
  );
};
