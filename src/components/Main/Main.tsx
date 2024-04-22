import * as React from "react";
import { Navigation } from "../Navigation/Navigation";
import "./style.scss";

export interface IMainProps {}
export const Main: React.FC<IMainProps> = function ({}) {
  return (
    <div className="main">
      <div className="container">
        <Navigation />
      </div>
    </div>
  );
};
