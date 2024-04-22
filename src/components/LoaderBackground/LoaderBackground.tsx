import * as React from "react";
import { useEffect } from "react";
import "./style.scss";
import { Loader } from "../UI/Loader/Loader";

export interface ILoaderBackgroundProps {}
export const LoaderBackground: React.FC<ILoaderBackgroundProps> =
  function ({}) {
    const scrollWidth =
      window.innerWidth - document.documentElement.clientWidth;

    useEffect(() => {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollWidth}px`;

      return () => {
        document.body.style.overflow = "visible";
        document.body.style.paddingRight = "0px";
      };
    }, []);

    return (
      <div className="loader-container">
        <Loader className={"white"} />
      </div>
    );
  };
