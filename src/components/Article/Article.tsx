import * as React from "react";
import { useEffect, useState } from "react";
import "./style.scss";
import { Button } from "../UI/Button/Button";
import { useNavigate } from "react-router-dom";
import { ReferenceType } from "../../screens/HomeScreen";
import {
  ArticleParamType,
  TypeArticleParams,
} from "../../screens/Articles/ArticleConstructScreen";
import { backUrl } from "../../api";

export interface IArticleProps {
  id: number;
  title: string;
  content: Array<ArticleParamType>;
  reference: ReferenceType;
  callback?: () => void;
}
export const Article: React.FC<IArticleProps> = function ({
  id,
  title,
  content,
  reference,
  callback,
}) {
  const navigate = useNavigate();
  const goToArticle = () => {
    navigate("/articles/" + id + "?reference=" + reference);
  };

  const [image, setImage] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  useEffect(() => {
    const contentDesc = content.find(
      (item) => item.type === TypeArticleParams.TEXT,
    );
    const contentImage = content.find(
      (item) => item.type === TypeArticleParams.IMAGE,
    );
    if (contentDesc && contentImage) {
      setImage(contentImage.content);
      setDesc(contentDesc.content);
    }
  }, [content]);

  return (
    <div className="tour-content" onClick={!!callback ? callback : goToArticle}>
      <div className="tour-content__image">
        <img src={backUrl + image} alt="image" />
      </div>
      <div className="tour-content__title">{title}</div>
      <div className="tour-content__desc">{desc}</div>
      <Button
        callback={!!callback ? callback : goToArticle}
        className="tour-content__btn"
      >
        Подробнее
      </Button>
    </div>
  );
};
