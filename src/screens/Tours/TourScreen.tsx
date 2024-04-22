import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../../components/UI/Button/Button";
import { goBack } from "../../services/navigate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { signTourApi, TourType } from "../../api/tours";
import { setLoadApp, setUserApp } from "../../redux/app";
import { likeTourAPI } from "../../api/likes";
import { getDataTours } from "../HomeScreen";
import { errorToast, infoToast, successToast } from "../../services/toast";
import { getDateByTime } from "../../services/time";
import { Likes } from "../../components/SVG/Likes";
import { CommentInput } from "../../components/Comments/CommentInput";
import { Comment } from "../../components/Comments/Comment";
import { backUrl } from "../../api";
import { createCommentTourAPI } from "../../api/comments";
import { RolesUser, UsersType } from "../../api/auth";
import { List } from "../../components/List/List";
import { TourAdmin } from "../../components/Tour/TourAdmin";

export interface ITourScreenProps {}
export const TourScreen: React.FC<ITourScreenProps> = function ({}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, _] = useSearchParams();

  const [currentTour, setCurrentTour] = useState<TourType>();
  const [like, setLike] = useState<boolean>(false);
  const [isSign, setIsSign] = useState<boolean>(false);

  const tours = useSelector((state: RootState) => state.tours.data);

  const user = useSelector((state: RootState) => state.app.user);
  const isAdmin = !!user && user.role === RolesUser.ADMIN;

  const goHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const art = tours.find((tour) => tour.id === Number(id));
    if (art) {
      setCurrentTour(art);
      setLike(
        art.likesUser.findIndex(
          (userLike) => !!user && user.id === userLike,
        ) !== -1,
      );
      setIsSign(
        art.signUser.findIndex((userSign) => !!user && user.id === userSign) !==
          -1,
      );
    } else goHome();
  }, [tours]);

  const likeUpdate = () => {
    if (currentTour?.id && user?.id) {
      dispatch(setLoadApp(true));
      const newLike = !like;
      likeTourAPI({
        idTour: currentTour?.id,
        idUser: user?.id,
        like: newLike ? currentTour?.likes + 1 : currentTour?.likes - 1,
        increment: newLike,
      })
        .then((result) => {
          if (result.status) {
            getDataTours(dispatch);
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

  const signTour = () => {
    if (currentTour?.id && user?.id) {
      dispatch(setLoadApp(true));
      signTourApi({
        idTour: currentTour?.id,
        idUser: user?.id,
        isSet: !isSign,
      })
        .then((result) => {
          if (result.status) {
            getDataTours(dispatch);
            setIsSign(!isSign);
            successToast(result.message);
            dispatch(setUserApp(result.result));
          } else {
            errorToast(result.message);
          }
        })
        .finally(() => {
          dispatch(setLoadApp(false));
        });
    } else {
      infoToast("Необходимо авторизоваться!");
    }
  };

  const comment = (
    id: number | undefined,
    field: string,
    setField: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    createCommentTourAPI({ idTour: id, text: field, author: user?.id })
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
        getDataTours(dispatch);
      });
  };

  return (
    <div className="tour article">
      <div className="tour-header">
        <div className="tour-header__title">{currentTour?.name}</div>
        <Button
          callback={() => goBack(searchParams, navigate)}
          className="tour-header__back"
        >
          Вернуться назад
        </Button>
      </div>
      <div className="tour-main">
        <div className="tour-main__image">
          <img src={backUrl + currentTour?.image} alt="image" />
        </div>
        <div className="tour-main__desc">
          Описание: {currentTour?.description}
        </div>
        <div className="tour-main__city">Город: {currentTour?.city}</div>
        <div className="tour-main__date">
          <span>Начало: {getDateByTime(currentTour?.dateStart)}</span>
          <span>Конец: {getDateByTime(currentTour?.dateEnd)}</span>
        </div>
        <div className="tour-main__price">
          Стоимость: <span>{currentTour?.price.toLocaleString()}</span> ₽
        </div>
        {isAdmin && (
          <List<number>
            title={"Пользователи, записавшиеся на тур"}
            data={currentTour?.signUser ?? []}
            element={(item) => <TourAdmin key={item} id={item} tourId={id} />}
          />
        )}
        <Button callback={signTour} className="tour-main__buy">
          {isSign ? "Отписаться" : "Записаться"}
        </Button>
      </div>
      <div className="article-footer">
        <div className="article-footer__likes" onClick={likeUpdate}>
          <div className="article-footer__likes-count">
            {currentTour?.likes}
          </div>{" "}
          <Likes color={like ? "#3868cc" : "#111111"} />
        </div>
        <CommentInput
          id={currentTour?.id}
          callback={(id, field, setField) => comment(id, field, setField)}
        />
        {currentTour?.comments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
    </div>
  );
};
