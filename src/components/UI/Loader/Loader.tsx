import * as React from "react";
import "./style.scss";

export interface ILoaderProps {
  className?: string;
}
export const Loader: React.FC<ILoaderProps> = function ({ className }) {
  return (
    <div id="arcs" className={className}>
      <div>
        <div>
          <div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};
