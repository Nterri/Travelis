import * as React from "react";
import { ReactNode } from "react";
import "./style.scss";

export interface IListProps<T> {
  title: string;
  data: Array<T>;
  element: (item: T, index: number) => ReactNode;
}
export function List<T>({ title, data, element }: IListProps<T>) {
  return (
    <div className="block-content">
      <div className="block-content__title">{title}</div>
      {data.length ? (
        <div className="block-content__list">
          {data.map((item, index) => (
            <div className="block-content__list-item" key={index}>
              {element(item, index)}
            </div>
          ))}
        </div>
      ) : (
        <div className="block-content__list">
          <div className="block-content__list-item__empty">
            Данных пока нет, пытаемся найти...
          </div>
        </div>
      )}
    </div>
  );
}
