import * as React from "react";
import { ReactNode, useEffect } from "react";
import "./style.scss";
import { Loader } from "../UI/Loader/Loader";

export enum LoadDataEnum {
  NOT_LOADING = "NOT_LOADING",
  LOADING = "LOADING",
  LOADED = "LOADED",
  FAILED = "FAILED",
}

export interface ILoadDataProps {
  status: LoadDataEnum;
  getData: () => void;
  children: ReactNode;
}
export const LoadData: React.FC<ILoadDataProps> = function ({
  status = LoadDataEnum.NOT_LOADING,
  getData,
  children,
}) {
  useEffect(() => {
    if (status === LoadDataEnum.NOT_LOADING) {
      getData();
    }
    if (status === LoadDataEnum.FAILED) {
      setTimeout(getData, 5000);
    }
  }, [status]);

  if (status === LoadDataEnum.LOADING) {
    return (
      <div className="load-content">
        <div className="loading">
          <Loader />
        </div>
        <div className="load-content__title">Загрузка...</div>
      </div>
    );
  }
  if (status === LoadDataEnum.LOADED && children) {
    return <>{children}</>;
  }
  if (status === LoadDataEnum.FAILED) {
    return (
      <div className="load-content">
        <div className="loading">
          <Loader />
        </div>
        <div className="load-content__title">Упс... Неприятность</div>
        <div className="load-content__desc">
          Информация не захотела приходить. Пробуем снова.
        </div>
      </div>
    );
  }
  return <></>;
};
