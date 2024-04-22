import * as React from "react";
import { useState } from "react";
import { Input } from "../UI/Input/Input";
import { Button } from "../UI/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { errorToast, infoToast } from "../../services/toast";
import "./style.scss";
import { setLoadApp } from "../../redux/app";

export interface ICommentInputProps {
  id: number | undefined;
  callback: (
    id: number | undefined,
    field: string,
    setField: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
}
export const CommentInput: React.FC<ICommentInputProps> = function ({
  id,
  callback,
}) {
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.app.user);

  const [field, setField] = useState<string>("");

  const submit = () => {
    if (!user) {
      infoToast("Для комментирования необходимо авторизоваться!");
      return;
    }
    if (!!field && !!user) {
      dispatch(setLoadApp(true));
      callback(id, field, setField);
    } else {
      errorToast("Заполните поле комментария!");
    }
  };

  return (
    <div className="comment-input">
      <Input
        label={"Комментарий"}
        value={field}
        onChange={(value) => setField(value)}
      />
      <Button callback={submit} className="search">
        Отправить
      </Button>
    </div>
  );
};
