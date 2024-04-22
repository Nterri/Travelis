import * as React from "react";
import { ReactNode, useEffect } from "react";
import "./style.scss";

export interface IModalProps {
  isVisible: boolean;
  setIsVisible: (flag: boolean) => void;
  children: ReactNode;
  title?: string;
  className?: string;
}
export const Modal: React.FC<IModalProps> = function ({
  isVisible,
  setIsVisible,
  children,
  title = "",
  className = "",
}) {
  const scrollWidth = window.innerWidth - document.documentElement.clientWidth;

  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "visible";
    document.body.style.paddingRight = isVisible ? `${scrollWidth}px` : "0px";
  }, [isVisible]);

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      setIsVisible(false);
    }
  });

  return (
    <div
      className={"modal " + (isVisible ? "isVisible " : "") + className}
      onClick={() => setIsVisible(false)}
    >
      <div
        className="modal-content block-content"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="modal-content__header">
          {!!title && (
            <>
              <div className="block-content__title modal-content__title">
                {title}
              </div>
              <div
                className="modal-content__close"
                onClick={() => setIsVisible(false)}
              >
                <span></span>
                <span></span>
              </div>
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};
