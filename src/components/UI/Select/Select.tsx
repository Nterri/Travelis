import * as React from "react";
import { useRef, useState } from "react";
import "./style.scss";

export interface IInputProps {
  value: string | undefined;
  array: Array<string>;
  onChange: (value: string) => void;
  label?: string;
  labelAfter?: string;
  required?: boolean;
  disabled?: boolean;
}
export const Select: React.FC<IInputProps> = function ({
  value,
  array,
  onChange,
  label = "Введите текст",
  labelAfter = "",
  required = false,
  disabled = false,
  ...props
}) {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const inputRef = useRef<HTMLSelectElement>(null);

  return (
    <div
      className={"container-input"}
      onClick={() => {
        if (!disabled) inputRef?.current?.focus();
      }}
    >
      <div className="wrapper-input">
        <div className={"label " + (isFocus || !!value ? "focus" : "")}>
          {label}
          {required ? "*" : ""}
          <span>{!!labelAfter ? ` (${labelAfter})` : ""}</span>
        </div>
        <select
          className="select"
          value={value}
          required={required}
          disabled={disabled}
          defaultValue={"DEFAULT"}
          onChange={(event) => {
            onChange(
              // @ts-ignore
              event.target.value,
            );
          }}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          ref={inputRef}
          {...props}
        >
          <option hidden selected value={"DEFAULT"}></option>
          {array.map((item, index) => (
            <option key={index} value={item} selected={item === value}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
