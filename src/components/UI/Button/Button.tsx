import * as React from "react";
import { ReactNode } from "react";
import "./style.scss";

export interface IButtonProps {
  children: ReactNode;
  className?: string;
  callback: () => void;
}
export const Button: React.FC<IButtonProps> = function ({
  children,
  className = "",
  callback,
}) {
  return (
    <button type="button" className={"button " + className} onClick={callback}>
      <div className="button-background"></div>
      <div className="button-content">{children}</div>
    </button>
  );
};
