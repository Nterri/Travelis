import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { Calendar as C } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { LooseValue } from "react-calendar/dist/cjs/shared/types";

export type DateType = {
  value: string;
  start: number;
  end: number;
};

export interface ICalendarProps {
  label?: string;
  labelAfter?: string;
  required?: boolean;
  value: DateType;
  setValue: (value: DateType) => void;
  error?: boolean;
  success?: boolean;
  showSuccess?: boolean;
  disabled?: boolean;
}
export const Calendar: React.FC<ICalendarProps> = function ({
  label = "Введите",
  labelAfter = "",
  required = false,
  value,
  setValue,
  error = false,
  success = false,
  showSuccess = true,
  disabled = false,
}) {
  const [localValue, setLocalValue] = useState<LooseValue>();
  const [isFocus, setIsFocus] = useState<boolean>(false);

  document.addEventListener("click", () => {
    setIsFocus(false);
  });

  useEffect(() => {
    // @ts-ignore
    if (localValue && localValue[0] && localValue[1]) {
      setValue({
        value:
          // @ts-ignore
          localValue[0].toLocaleDateString() +
          " - " +
          // @ts-ignore
          localValue[1].toLocaleDateString(),
        // @ts-ignore
        start: localValue[0].getTime(),
        // @ts-ignore
        end: localValue[1].getTime(),
      });
      setIsFocus(false);
    }
  }, [localValue]);

  useEffect(() => {
    if (!value.value) {
      setIsFocus(false);
      setLocalValue(undefined);
    }
  }, [value]);

  return (
    <div
      className={
        "container-calendar " +
        (success && showSuccess ? "success-color " : "") +
        (error && !isFocus ? "error-color" : "")
      }
      onClick={(ev) => {
        ev.stopPropagation();
        if (!disabled) setIsFocus(true);
      }}
    >
      <div className={"label " + (isFocus || !!localValue ? "focus" : "")}>
        {label}
        {!!labelAfter ? `(${labelAfter})` : ""}
        {required ? "*" : ""}
      </div>
      <div className="wrapper-input">
        <div className="input">{value.value}</div>
        {error && !success && !isFocus && (
          <div className="error">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#ff0000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M7.493 0.015 C 7.442 0.021,7.268 0.039,7.107 0.055 C 5.234 0.242,3.347 1.208,2.071 2.634 C 0.660 4.211,-0.057 6.168,0.009 8.253 C 0.124 11.854,2.599 14.903,6.110 15.771 C 8.169 16.280,10.433 15.917,12.227 14.791 C 14.017 13.666,15.270 11.933,15.771 9.887 C 15.943 9.186,15.983 8.829,15.983 8.000 C 15.983 7.171,15.943 6.814,15.771 6.113 C 14.979 2.878,12.315 0.498,9.000 0.064 C 8.716 0.027,7.683 -0.006,7.493 0.015 M8.853 1.563 C 9.967 1.707,11.010 2.136,11.944 2.834 C 12.273 3.080,12.920 3.727,13.166 4.056 C 13.727 4.807,14.142 5.690,14.330 6.535 C 14.544 7.500,14.544 8.500,14.330 9.465 C 13.916 11.326,12.605 12.978,10.867 13.828 C 10.239 14.135,9.591 14.336,8.880 14.444 C 8.456 14.509,7.544 14.509,7.120 14.444 C 5.172 14.148,3.528 13.085,2.493 11.451 C 2.279 11.114,1.999 10.526,1.859 10.119 C 1.618 9.422,1.514 8.781,1.514 8.000 C 1.514 6.961,1.715 6.075,2.160 5.160 C 2.500 4.462,2.846 3.980,3.413 3.413 C 3.980 2.846,4.462 2.500,5.160 2.160 C 6.313 1.599,7.567 1.397,8.853 1.563 M7.706 4.290 C 7.482 4.363,7.355 4.491,7.293 4.705 C 7.257 4.827,7.253 5.106,7.259 6.816 C 7.267 8.786,7.267 8.787,7.325 8.896 C 7.398 9.033,7.538 9.157,7.671 9.204 C 7.803 9.250,8.197 9.250,8.329 9.204 C 8.462 9.157,8.602 9.033,8.675 8.896 C 8.733 8.787,8.733 8.786,8.741 6.816 C 8.749 4.664,8.749 4.662,8.596 4.481 C 8.472 4.333,8.339 4.284,8.040 4.276 C 7.893 4.272,7.743 4.278,7.706 4.290 M7.786 10.530 C 7.597 10.592,7.410 10.753,7.319 10.932 C 7.249 11.072,7.237 11.325,7.294 11.495 C 7.388 11.780,7.697 12.000,8.000 12.000 C 8.303 12.000,8.612 11.780,8.706 11.495 C 8.763 11.325,8.751 11.072,8.681 10.932 C 8.616 10.804,8.460 10.646,8.333 10.580 C 8.217 10.520,7.904 10.491,7.786 10.530 "
                  stroke="none"
                  fillRule="evenodd"
                  fill="#ff0000"
                ></path>
              </g>
            </svg>
          </div>
        )}
        {showSuccess && success && !error && (
          <div className="success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 48 48"
              stroke="#008000"
            >
              <path
                fill="#008000"
                d="M 24 3 C 12.413858 3 3 12.413866 3 24 C 3 35.586134 12.413858 45 24 45 C 35.586142 45 45 35.586134 45 24 C 45 12.413866 35.586142 3 24 3 z M 24 5 C 34.505263 5 43 13.494744 43 24 C 43 34.505256 34.505263 43 24 43 C 13.494737 43 5 34.505256 5 24 C 5 13.494744 13.494737 5 24 5 z M 33.951172 15.990234 A 1.0001 1.0001 0 0 0 33.208984 16.388672 L 22.244141 30.568359 L 14.640625 24.232422 A 1.0001 1.0001 0 1 0 13.359375 25.767578 L 21.759766 32.767578 A 1.0001 1.0001 0 0 0 23.191406 32.611328 L 34.791016 17.611328 A 1.0001 1.0001 0 0 0 33.951172 15.990234 z"
              ></path>
            </svg>
          </div>
        )}
      </div>
      {isFocus && (
        <C
          onChange={(value) => {
            setIsFocus(false);
            setLocalValue(value);
          }}
          value={localValue}
          selectRange
          className={"calendar"}
        />
      )}
    </div>
  );
};
