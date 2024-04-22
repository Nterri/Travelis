import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/UI/Button/Button";
import { goBack } from "../../services/navigate";
import { Modal } from "../../components/UI/Modal/Modal";
import { Input, InputTypeEnum } from "../../components/UI/Input/Input";
import { useDragAndDrop } from "@formkit/drag-and-drop/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { createArticlesAPI } from "../../api/articles";
import { setLoadApp } from "../../redux/app";
import { errorToast, successToast } from "../../services/toast";
import { getSubjectsAPI } from "../../api/subjects";
import { subjectMapping } from "../../services/mapping";
import { setDateSubjects, SubjectType } from "../../redux/subjects";
import { Select } from "../../components/UI/Select/Select";
import { getDataArticles } from "../HomeScreen";

export enum TypeArticleParams {
  TITLE = "TITLE",
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  NOTE = "NOTE",
}

export type ArticleParamType = {
  type: TypeArticleParams;
  content: string;
};

export const getNameItem = (name: TypeArticleParams) => {
  switch (name) {
    case TypeArticleParams.TITLE:
      return "Заголовок";
    case TypeArticleParams.TEXT:
      return "Текст";
    case TypeArticleParams.IMAGE:
      return "Картинка";
    case TypeArticleParams.NOTE:
      return "Примечание";
    default:
      return "Неизвестно";
  }
};
export const getSubjects = (dispatch: AppDispatch) => {
  dispatch(setLoadApp(true));
  getSubjectsAPI()
    .then((result) => {
      if (result.status) {
        dispatch(
          setDateSubjects(
            [...result.result].map((item) => subjectMapping(item)),
          ),
        );
      }
    })
    .finally(() => dispatch(setLoadApp(false)));
};
export interface IArticleConstructScreenProps {}
export const ArticleConstructScreen: React.FC<IArticleConstructScreenProps> =
  function ({}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const subjects = useSelector((state: RootState) => state.subjects.data);

    const user = useSelector((state: RootState) => state.app.user);

    useEffect(() => {
      getSubjects(dispatch);
    }, []);

    const goHome = () => {
      navigate("/");
    };

    useEffect(() => {
      if (!user) goHome();
    }, [user]);

    const [searchParams, _] = useSearchParams();
    const [addItemModal, setAddItemModal] = useState<boolean>(false);
    const [nameArticle, setNameArticle] = useState<string>("");
    const [subjectArticle, setSubjectArticle] = useState<SubjectType>();
    const [parent, arrayArticleParams, setArrayArticleParams] = useDragAndDrop<
      any,
      ArticleParamType
    >([]);

    const addItem = (name: TypeArticleParams) => {
      setArrayArticleParams([
        ...arrayArticleParams,
        {
          type: name,
          content: "",
        },
      ]);
    };

    const changeContentItem = (id: number, text: string) => {
      setArrayArticleParams(
        arrayArticleParams.map((item, index) =>
          index === id
            ? {
                ...item,
                content: text,
              }
            : item,
        ),
      );
    };

    const deleteItem = (id: number) => {
      setArrayArticleParams(
        arrayArticleParams.filter((_, index) => index !== id),
      );
    };

    const create = () => {
      const arrayContent = arrayArticleParams.filter((item) => !!item.content);
      const arrayImage = arrayArticleParams
        .filter((item) => item.type === TypeArticleParams.IMAGE)
        .map((item) => item.content);
      if (
        !!nameArticle &&
        !!subjectArticle &&
        arrayArticleParams.filter((item) => !!item.content).length ===
          arrayArticleParams.length
      ) {
        dispatch(setLoadApp(true));
        createArticlesAPI({
          nameArticle,
          arrayContent,
          arrayImage,
          subject: subjectArticle?.id,
          idUser: user?.id,
        })
          .then((result) => {
            if (result.status) {
              setAddItemModal(false);
              setNameArticle("");
              setSubjectArticle(undefined);
              setArrayArticleParams([]);
              successToast(result.message);
              getDataArticles(dispatch);
            } else {
              errorToast(result.message);
            }
          })
          .catch(() => errorToast("Ошибка создания статьи! Попробуйте снова!"))
          .finally(() => dispatch(setLoadApp(false)));
      } else {
        errorToast(
          "Не все поля оказались заполнены! Заполните пустые поля или удалите!",
        );
      }
    };

    return (
      <div className="article">
        <div className="article-header">
          <div className="article-header__title">Создание статьи</div>
          <Button
            callback={() => goBack(searchParams, navigate)}
            className="article-header__back"
          >
            Вернуться назад
          </Button>
        </div>
        <Select
          label={"Тематика"}
          required
          value={subjectArticle?.name}
          onChange={(value) =>
            setSubjectArticle(
              subjects.find((subject) => subject.name === value),
            )
          }
          array={subjects.map((subject) => subject.name)}
        />
        <div className="article-create">
          <div className="article-create__item">
            <div className="article-create__item-header">
              <div className="article-create-header__title">
                Название статьи
              </div>
            </div>
            <Input
              required
              value={nameArticle}
              onChange={(value) => setNameArticle(value)}
            />
          </div>
          <div className="create-block" ref={parent}>
            {arrayArticleParams.map((item, index) => (
              <div
                key={index}
                data-label={item.type}
                className="article-create__item"
              >
                <div className="article-create__item-header">
                  <div className="article-create-header__title">
                    {getNameItem(item.type)}
                  </div>
                  <Button
                    callback={() => deleteItem(index)}
                    className="article-create-header__btn"
                  >
                    Удалить
                  </Button>
                </div>
                {item.type === TypeArticleParams.IMAGE ? (
                  <Input
                    required
                    type={InputTypeEnum.FILE}
                    value={item.content}
                    onChange={(value) => changeContentItem(index, value)}
                  />
                ) : (
                  <Input
                    required
                    value={item.content}
                    onChange={(value) => changeContentItem(index, value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="article-create__panel">
          <Button
            callback={() => setAddItemModal(!addItemModal)}
            className="article-header__report"
          >
            Добавить блок
          </Button>
          <Button callback={create} className="article-header__report">
            Создать статью
          </Button>
        </div>
        <Modal
          title={"Выбор элемента для добавления:"}
          isVisible={addItemModal}
          setIsVisible={(flag) => setAddItemModal(flag)}
        >
          <div className="article-modal column">
            {[
              TypeArticleParams.TITLE,
              TypeArticleParams.TEXT,
              TypeArticleParams.IMAGE,
              TypeArticleParams.NOTE,
            ].map((item, index) => (
              <Button
                key={index}
                callback={() => {
                  addItem(item);
                  setAddItemModal(!addItemModal);
                }}
                className="article-header__yes-or-no"
              >
                {getNameItem(item)}
              </Button>
            ))}
          </div>
        </Modal>
      </div>
    );
  };
