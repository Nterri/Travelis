import * as React from "react";
import { useState } from "react";
import { Button } from "../../components/UI/Button/Button";
import {
  defaultInputValue,
  Input,
  InputType,
  InputTypeEnum,
} from "../../components/UI/Input/Input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { emailRegExp, validate, validateAll } from "../../services/validation";
import { Calendar, DateType } from "../../components/UI/Calendar/Calendar";
import { createTourAPI } from "../../api/admin";
import { errorToast, successToast } from "../../services/toast";
import { setLoadApp } from "../../redux/app";
import { getDataTours } from "../HomeScreen";

export interface IAddTourScreenProps {}
export const AddTourScreen: React.FC<IAddTourScreenProps> = function ({}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState<InputType>(defaultInputValue);
  const [image, setImage] = useState<InputType>(defaultInputValue);
  const [description, setDescription] = useState<InputType>(defaultInputValue);
  const [city, setCity] = useState<InputType>(defaultInputValue);
  const [date, setDate] = useState<DateType>({
    value: "",
    start: 0,
    end: 0,
  });
  const [price, setPrice] = useState<InputType<number>>({
    value: 0,
    error: false,
    success: false,
  });

  const goBack = () => {
    navigate("/profile");
  };

  const create = () => {
    if (
      validateAll([
        {
          value: name.value,
          setValue: setName,
        },
        {
          value: image.value,
          setValue: setImage,
        },
        {
          value: description.value,
          setValue: setDescription,
        },
        {
          value: city.value,
          setValue: setCity,
        },
      ]) &&
      !!date.value &&
      validate<number>({
        value: price.value,
        setValue: setPrice,
        minLength: 1,
      })
    ) {
      dispatch(setLoadApp(true));
      createTourAPI({
        name: name.value,
        image: image.value,
        description: description.value,
        city: city.value,
        dateStart: date.start,
        dateEnd: date.end,
        price: price.value,
      })
        .then((result) => {
          if (result.status) {
            successToast(result.message);
            setName(defaultInputValue);
            setImage(defaultInputValue);
            setDescription(defaultInputValue);
            setCity(defaultInputValue);
            setDate({
              value: "",
              start: 0,
              end: 0,
            });
            setPrice({
              value: 0,
              error: false,
              success: false,
            });
            getDataTours(dispatch);
          } else {
            errorToast(result.message);
          }
        })
        .finally(() => {
          dispatch(setLoadApp(false));
        });
    }
  };

  return (
    <div className="article">
      <div className="article-header">
        <div className="article-header__title">Создание тура</div>
        <Button callback={goBack} className="article-header__back">
          Вернуться назад
        </Button>
      </div>
      <div className="article-create">
        <Input
          label={"Название"}
          required
          value={name.value}
          error={name.error}
          success={name.success}
          onChange={(value) =>
            validate({
              value: value,
              setValue: setName,
            })
          }
        />
        <div className="article-create__item">
          <div className="article-create__item-header">
            <div className="article-create-header__title small">
              Изображение
            </div>
          </div>
          <Input
            required
            type={InputTypeEnum.FILE}
            value={image.value}
            error={image.error}
            onChange={(value) =>
              validate({
                value: value,
                setValue: setImage,
              })
            }
          />
        </div>
        <Input
          label={"Описание"}
          required
          value={description.value}
          error={description.error}
          success={description.success}
          onChange={(value) =>
            validate({
              value: value,
              setValue: setDescription,
            })
          }
        />
        <Input
          label={"Город"}
          required
          value={city.value}
          error={city.error}
          success={city.success}
          onChange={(value) =>
            validate({
              value: value,
              setValue: setCity,
            })
          }
        />
        <Calendar
          label={"Начало - конец"}
          value={date}
          required
          success={!!date.value}
          setValue={(value) => setDate(value)}
        />
        <Input
          label={"Стоимость"}
          required
          type={InputTypeEnum.NUMBER}
          value={price.value}
          error={price.error}
          success={price.success}
          onChange={(value) =>
            validate({
              value: value,
              setValue: setPrice,
              minLength: 1,
            })
          }
        />
      </div>
      <div className="article-create__panel">
        <Button callback={create} className="article-header__report">
          Создать тур
        </Button>
      </div>
    </div>
  );
};
