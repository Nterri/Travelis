import * as React from "react";
import { useEffect, useState } from "react";
import { CommentType } from "../../api/comments";
import { Likes } from "../SVG/Likes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setLoadApp } from "../../redux/app";
import { likeCommentAPI } from "../../api/likes";
import { getDataArticles } from "../../screens/HomeScreen";
import { errorToast, infoToast, successToast } from "../../services/toast";
import { hideCommentAPI } from "../../api/admin";
import { RolesUser } from "../../api/auth";
import { Button } from "../UI/Button/Button";

export interface ICommentProps {
  comment: CommentType;
}
export const Comment: React.FC<ICommentProps> = function ({ comment }) {
  const dispatch = useDispatch();

  const [like, setLike] = useState<boolean>(false);

  const user = useSelector((state: RootState) => state.app.user);

  useEffect(() => {
    setLike(
      comment.likesUser.findIndex(
        (userLike) => !!user && user.id === userLike,
      ) !== -1,
    );
  }, [comment]);

  const likeUpdate = () => {
    if (comment?.id && user?.id) {
      dispatch(setLoadApp(true));
      const newLike = !like;
      likeCommentAPI({
        idComment: comment?.id,
        idUser: user?.id,
        like: newLike ? comment?.likes + 1 : comment?.likes - 1,
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

  const hideComment = () => {
    dispatch(setLoadApp(true));
    hideCommentAPI({ id: comment.id })
      .then((result) => {
        if (result.status) {
          successToast(result.message);
          getDataArticles(dispatch);
        } else {
          errorToast(result.message);
        }
      })
      .finally(() => {
        dispatch(setLoadApp(false));
      });
  };

  return (
    <div className="comment">
      <div className="comment-header">
        <div className="comment-header__text">{comment.text}</div>
      </div>
      <div className="comment-main">
        <div className="comment-main__author">Автор: {comment.email}</div>
        <div className="comment-main__time">Дата создания: {comment.time}</div>
        {!!user && user.role === RolesUser.ADMIN && (
          <Button callback={hideComment} className="comment-main__hide">
            Скрыть
          </Button>
        )}
        <div className="comment-main__like" onClick={likeUpdate}>
          {comment.likes}
          <Likes color={like ? "#3868cc" : "#111111"} />
        </div>
      </div>
    </div>
  );
};
