import * as React from "react";
import "./style.scss";

export interface IFooterProps {}
export const Footer: React.FC<IFooterProps> = function ({}) {
  return (
    <div className="footer">
      <div className="container">(c) 2024 год. Все права защищены.</div>
    </div>
  );
};
