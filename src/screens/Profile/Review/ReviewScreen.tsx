import * as React from "react";
import { LoadData, LoadDataEnum } from "../../../components/LoadData/LoadData";
import { List } from "../../../components/List/List";
import { ArticlesType } from "../../../api/articles";
import { Article } from "../../../components/Article/Article";
import { ReferenceType } from "../../HomeScreen";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { getReviewArticlesAPI } from "../../../api/admin";
import { setLoadReviewArticles, setReviewArticles } from "../../../redux/admin";
import { useNavigate } from "react-router-dom";

export const getReviewArticles = (dispatch: AppDispatch) => {
  dispatch(setLoadReviewArticles(LoadDataEnum.LOADING));
  getReviewArticlesAPI()
    .then((result) => {
      dispatch(setLoadReviewArticles(LoadDataEnum.LOADED));
      if (result.status) {
        dispatch(setReviewArticles(result.result));
      }
    })
    .catch(() => {
      dispatch(setLoadReviewArticles(LoadDataEnum.FAILED));
    });
};
export interface IReviewScreenProps {}
export const ReviewScreen: React.FC<IReviewScreenProps> = function ({}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loadingReviewArticles = useSelector(
    (state: RootState) => state.admin.loadingReviewArticles,
  );
  const reviewArticles = useSelector(
    (state: RootState) => state.admin.reviewArticles,
  );

  return (
    <LoadData
      status={loadingReviewArticles}
      getData={() => getReviewArticles(dispatch)}
    >
      <List<ArticlesType>
        title={"Статьи на проверку"}
        data={reviewArticles}
        element={(item) => (
          <Article
            id={item.id}
            title={item.name}
            content={item.content}
            reference={ReferenceType.HOME_SCREEN}
            callback={() =>
              navigate(
                "/profile/review/" +
                  item.id +
                  "?reference=" +
                  ReferenceType.REVIEW_SCREEN,
              )
            }
          />
        )}
      />
    </LoadData>
  );
};
