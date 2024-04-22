import * as React from "react";
import { LoadData } from "../../components/LoadData/LoadData";
import { List } from "../../components/List/List";
import { Article } from "../../components/Article/Article";
import { getDataArticles, ReferenceType } from "../HomeScreen";
import { Button } from "../../components/UI/Button/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ArticlesType } from "../../api/articles";

export interface IArticlesScreenProps {}
export const ArticlesScreen: React.FC<IArticlesScreenProps> = function ({}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const articlesLoading = useSelector(
    (state: RootState) => state.articles.loading,
  );
  const articles = useSelector((state: RootState) => state.articles.data);

  const user = useSelector((state: RootState) => state.app.user);

  const goToArticleCreate = () => {
    navigate(
      "/articles/create" + "?reference=" + ReferenceType.ARTICLES_SCREEN,
    );
  };

  return (
    <LoadData
      status={articlesLoading}
      getData={() => getDataArticles(dispatch)}
    >
      <List<ArticlesType>
        title={"Наши статьи"}
        data={articles}
        element={(item, index) => (
          <Article
            id={item.id}
            title={item.name}
            content={item.content}
            reference={ReferenceType.ARTICLES_SCREEN}
          />
        )}
      />
      {!!user && (
        <Button callback={goToArticleCreate} className="article-header__back">
          Создать статью
        </Button>
      )}
    </LoadData>
  );
};
