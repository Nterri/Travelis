import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ArticlesType } from "../../../api/articles";
import { TypeArticleParams } from "../../Articles/ArticleConstructScreen";
import { backUrl } from "../../../api";
import { Likes } from "../../../components/SVG/Likes";
import { Comment } from "../../../components/Comments/Comment";
import { Button } from "../../../components/UI/Button/Button";
import { goBack } from "../../../services/navigate";
import { setLoadApp } from "../../../redux/app";
import { acceptArticleAPI } from "../../../api/admin";
import { errorToast, successToast } from "../../../services/toast";
import { getReviewArticles } from "./ReviewScreen";
import { getDataArticles } from "../../HomeScreen";

export interface IReviewItemScreenProps {}
export const ReviewItemScreen: React.FC<IReviewItemScreenProps> =
  function ({}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams, _] = useSearchParams();
    const dispatch = useDispatch();
    const reviewArticles = useSelector(
      (state: RootState) => state.admin.reviewArticles,
    );
    const [articleReview, setArticleReview] = useState<ArticlesType>();

    const goHome = () => {
      navigate("/");
    };

    useEffect(() => {
      // @ts-ignore
      const art = reviewArticles.find((article) => article.id == id);
      if (art) {
        setArticleReview(art);
      } else goHome();
    }, [reviewArticles, id]);

    const acceptArticle = () => {
      dispatch(setLoadApp(true));
      acceptArticleAPI({ id: articleReview?.id })
        .then((result) => {
          if (result.status) {
            successToast(result.message);
            getReviewArticles(dispatch);
            getDataArticles(dispatch);
            goBack(searchParams, navigate);
          } else {
            errorToast(result.message);
          }
        })
        .finally(() => dispatch(setLoadApp(false)));
    };

    if (articleReview)
      return (
        <div className="article">
          <div className="article-header">
            <div className="article-header__title">
              {articleReview?.name}{" "}
              <span>
                {!articleReview.enable
                  ? "Первичное добавление"
                  : articleReview.report
                    ? `Жалоба${!!articleReview.reasonReport ? ". Причина: " + articleReview.reasonReport : ""}`
                    : ""}
              </span>
            </div>
            <Button
              callback={() => goBack(searchParams, navigate)}
              className="article-header__back"
            >
              Вернуться назад
            </Button>
          </div>
          <div className="article-main">
            {articleReview?.content.map((item, index) => (
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
            <div className="article-footer__likes">
              <div className="article-footer__likes-count">
                {articleReview?.likes}
              </div>{" "}
              <Likes color={"#111111"} />
            </div>
            <div className="article-footer__author">
              Автор:{" "}
              <span>
                {articleReview?.lastName} {articleReview?.firstName}{" "}
                {articleReview?.patronymic} ({articleReview?.email})
              </span>
            </div>
            {articleReview?.comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </div>
          <Button callback={acceptArticle} className="article-accept">
            Одобрить
          </Button>
        </div>
      );
    return <></>;
  };
