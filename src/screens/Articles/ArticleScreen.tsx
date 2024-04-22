import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../../components/UI/Button/Button";
import { goBack } from "../../services/navigate";
import { Modal } from "../../components/UI/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArticlesType, reportArticle } from "../../api/articles";
import { getDataArticles } from "../HomeScreen";
import { setDataArticles } from "../../redux/articles";
import { setLoadApp } from "../../redux/app";
import { errorToast, infoToast, successToast } from "../../services/toast";
import { TypeArticleParams } from "./ArticleConstructScreen";
import { backUrl } from "../../api";
import { CommentInput } from "../../components/Comments/CommentInput";
import { Comment } from "../../components/Comments/Comment";
import { Likes } from "../../components/SVG/Likes";
import { likeArticleAPI } from "../../api/likes";
import { RolesUser } from "../../api/auth";
import {
  defaultInputValue,
  Input,
  InputType,
} from "../../components/UI/Input/Input";
import { validate } from "../../services/validation";
import { hideArticleAPI } from "../../api/admin";
import { createCommentArticleAPI } from "../../api/comments";

export interface IArticleScreenProps {}
export const ArticleScreen: React.FC<IArticleScreenProps> = function ({}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const [like, setLike] = useState<boolean>(false);
  const [successReportModal, setSuccessReportModal] = useState<boolean>(false);
  const [hideArticleModal, setHideArticleModal] = useState<boolean>(false);
  const [hideField, setHideField] = useState<InputType>(defaultInputValue);
  const [currentArticle, setCurrentArticle] = useState<ArticlesType>();

  const user = useSelector((state: RootState) => state.app.user);

  const articles = useSelector((state: RootState) => state.articles.data);

  const goHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const art = articles.find((article) => article.id === Number(id));
    if (art) {
      setCurrentArticle(art);
      setLike(
        art.likesUser.findIndex(
          (userLike) => !!user && user.id === userLike,
        ) !== -1,
      );
    } else goHome();
  }, [articles]);

  const report = () => {
    dispatch(setLoadApp(true));
    reportArticle({ idArticle: currentArticle?.id, idUser: user?.id })
      .then((result) => {
        if (result.status) {
          dispatch(setDataArticles(result.result));
          successToast(result.message);
        } else {
          errorToast(result.message);
        }
      })
      .catch(() => errorToast("Ошибка отправки жалобы!"))
      .finally(() => {
        dispatch(setLoadApp(false));
      });
  };

  const likeUpdate = () => {
    if (currentArticle?.id && user?.id) {
      dispatch(setLoadApp(true));
      const newLike = !like;
      likeArticleAPI({
        idArticle: currentArticle?.id,
        idUser: user?.id,
        like: newLike ? currentArticle?.likes + 1 : currentArticle?.likes - 1,
        increment: newLike,
      })
        .then((result) => {
          if (result.status) {
            getDataArticles(dispatch);
            setLike(newLike);
          }
        })
        .finally(() => {
          dispatch(setLoadApp(false));
        });
    } else {
      infoToast("Необходимо авторизоваться!");
    }
  };

  const hideArticle = () => {
    if (
      validate({
        value: hideField.value,
        setValue: setHideField,
      })
    ) {
      setHideArticleModal(!hideArticleModal);
      setHideField(defaultInputValue);

      dispatch(setLoadApp(true));
      hideArticleAPI({ id: currentArticle?.id, text: hideField.value })
        .then((result) => {
          if (result.status) {
            goBack(searchParams, navigate);
            successToast(result.message);
            getDataArticles(dispatch);
          } else {
            errorToast(result.message);
          }
        })
        .catch(() => {
          errorToast("Ошибки при скрытии статьи! Попробуйте ещё раз!");
        })
        .finally(() => {
          dispatch(setLoadApp(false));
        });
    }
  };

  const comment = (
    id: number | undefined,
    field: string,
    setField: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    createCommentArticleAPI({ idArticle: id, text: field, author: user?.id })
      .then((result) => {
        if (result.status) {
          setField("");
          successToast(result.message);
        } else {
          errorToast(result.message);
        }
      })
      .catch(() =>
        errorToast("Ошибка добавления комментария! Попробуйте ещё раз!"),
      )
      .finally(() => {
        dispatch(setLoadApp(false));
        getDataArticles(dispatch);
      });
  };

  return (
    <div className="article">
      <div className="article-header">
        <div className="article-header__title">{currentArticle?.name}</div>
        <Button
          callback={() => goBack(searchParams, navigate)}
          className="article-header__back"
        >
          Вернуться назад
        </Button>
        {user && !currentArticle?.report && (
          <Button
            callback={() => setSuccessReportModal(!successReportModal)}
            className="article-header__report"
          >
            Пожаловаться
          </Button>
        )}
        {user && user.role === RolesUser.ADMIN && (
          <Button
            callback={() => setHideArticleModal(!hideArticleModal)}
            className="article-header__report"
          >
            Скрыть статью
          </Button>
        )}
      </div>
      <div className="article-main">
        {currentArticle?.content.map((item, index) => (
          <div
            key={index}
            data-label={item.type}
            className={"article-main__item " + item.type}
          >
            {item.type === TypeArticleParams.IMAGE ? (
              <img src={backUrl + item.content} alt="image" />
            ) : (
              item.content
            )}
          </div>
        ))}
      </div>
      <div className="article-footer">
        <div className="article-footer__likes" onClick={likeUpdate}>
          <div className="article-footer__likes-count">
            {currentArticle?.likes}
          </div>{" "}
          <Likes color={like ? "#3868cc" : "#111111"} />
        </div>
        <div className="article-footer__author">
          Автор:{" "}
          <span>
            {currentArticle?.lastName} {currentArticle?.firstName}{" "}
            {currentArticle?.patronymic} ({currentArticle?.email})
          </span>
        </div>
        <CommentInput
          id={currentArticle?.id}
          callback={(id, field, setField) => comment(id, field, setField)}
        />
        {currentArticle?.comments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
      <Modal
        title={"Вы уверены, что хотите пожаловаться?"}
        isVisible={successReportModal}
        setIsVisible={(flag) => setSuccessReportModal(flag)}
      >
        <div className="article-modal">
          <Button
            callback={() => {
              setSuccessReportModal(!successReportModal);
              report();
            }}
            className="article-header__yes-or-no"
          >
            Да
          </Button>
          <Button
            callback={() => setSuccessReportModal(!successReportModal)}
            className="article-header__yes-or-no"
          >
            Нет
          </Button>
        </div>
      </Modal>
      <Modal
        title={"Вы уверены, что хотите скрыть статью?"}
        isVisible={hideArticleModal}
        setIsVisible={(flag) => setHideArticleModal(flag)}
      >
        <div className="article-modal column">
          <Input
            label={"Причина"}
            required
            value={hideField.value}
            error={hideField.error}
            success={hideField.success}
            onChange={(value) =>
              validate({
                value: value,
                setValue: setHideField,
              })
            }
          />
          <Button callback={hideArticle} className="article-header__yes-or-no">
            Да
          </Button>
          <Button
            callback={() => setHideArticleModal(!hideArticleModal)}
            className="article-header__yes-or-no"
          >
            Нет
          </Button>
        </div>
      </Modal>
    </div>
  );
};
