import * as React from "react";
import { FormTravel } from "../components/Forms/FormTravel/FormTravel";
import { List } from "../components/List/List";
import { Tour } from "../components/Tour/Tour";
import { Article } from "../components/Article/Article";
import { LoadData, LoadDataEnum } from "../components/LoadData/LoadData";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setDataArticles, setLoadArticles } from "../redux/articles";
import { ArticlesType, getArticlesAPI } from "../api/articles";
import { setDataTours, setLoadTours } from "../redux/tours";
import { getToursAPI, TourType } from "../api/tours";
import { Partner } from "../components/Partner/Partner";

export enum ReferenceType {
  HOME_SCREEN = "HOME",
  TOURS_SCREEN = "TOURS",
  ARTICLES_SCREEN = "ARTICLES",
  REVIEW_SCREEN = "REVIEW",
}

export interface IHomeScreenProps {}

export const getDataArticles = (dispatch: AppDispatch) => {
  dispatch(setLoadArticles(LoadDataEnum.LOADING));
  getArticlesAPI()
    .then((result) => {
      dispatch(setLoadArticles(LoadDataEnum.LOADED));
      if (result.status) {
        dispatch(setDataArticles(result.result));
      }
    })
    .catch(() => {
      dispatch(setLoadArticles(LoadDataEnum.FAILED));
    });
};

export const getDataTours = (dispatch: AppDispatch) => {
  dispatch(setLoadTours(LoadDataEnum.LOADING));
  getToursAPI()
    .then((result) => {
      dispatch(setLoadTours(LoadDataEnum.LOADED));
      if (result.status) {
        dispatch(setDataTours(result.result));
      }
    })
    .catch(() => {
      dispatch(setLoadTours(LoadDataEnum.FAILED));
    });
};
export const HomeScreen: React.FC<IHomeScreenProps> = function ({}) {
  const articlesLoading = useSelector(
    (state: RootState) => state.articles.loading,
  );
  const articles = useSelector((state: RootState) => state.articles.data);

  const toursLoading = useSelector((state: RootState) => state.tours.loading);
  const tours = useSelector((state: RootState) => state.tours.data);

  const dispatch = useDispatch();

  return (
    <>
      <Partner />
      <FormTravel />
      <LoadData status={toursLoading} getData={() => getDataTours(dispatch)}>
        <List<TourType>
          title={"Наши туры"}
          data={tours}
          element={(item) => (
            <Tour
              id={item.id}
              title={item.name}
              image={item.image}
              desc={item.description}
              dateStart={item.dateStart}
              dateEnd={item.dateEnd}
              reference={ReferenceType.HOME_SCREEN}
            />
          )}
        />
      </LoadData>
      <LoadData
        status={articlesLoading}
        getData={() => getDataArticles(dispatch)}
      >
        <List<ArticlesType>
          title={"Наши статьи"}
          data={articles}
          element={(item) => (
            <Article
              id={item.id}
              title={item.name}
              content={item.content}
              reference={ReferenceType.HOME_SCREEN}
            />
          )}
        />
      </LoadData>
    </>
  );
};
