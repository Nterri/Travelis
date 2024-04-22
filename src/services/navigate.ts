import { ReferenceType } from "../screens/HomeScreen";
import { NavigateFunction } from "react-router-dom";

export const goBack = (
  searchParams: URLSearchParams,
  navigate: NavigateFunction,
) => {
  switch (searchParams.get("reference")) {
    case ReferenceType.HOME_SCREEN: {
      navigate("/");
      break;
    }
    case ReferenceType.ARTICLES_SCREEN: {
      navigate("/articles");
      break;
    }
    case ReferenceType.TOURS_SCREEN: {
      navigate("/tours");
      break;
    }
    case ReferenceType.REVIEW_SCREEN: {
      navigate("/profile/review");
      break;
    }
  }
};
