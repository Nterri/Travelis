import * as React from "react";
import "./style.scss";

export interface IPartnerProps {}
export const Partner: React.FC<IPartnerProps> = function ({}) {
  return (
    <div className="block-content">
      <div className="block-content__title">Партнерские предложения</div>
      <div className="partner__list">
        <a target="_blank" href="https://www.aviasales.ru/" className="link">
          Поиск авиабилетов
        </a>
        <a target="_blank" href="https://rzd.ru/" className="link">
          Поиск ж/д билетов
        </a>
        <a target="_blank" href="https://www.booking.com/" className="link">
          Поиск жилья
        </a>
      </div>
    </div>
  );
};
