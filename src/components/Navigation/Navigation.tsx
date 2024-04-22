import * as React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomeScreen } from "../../screens/HomeScreen";
import { ToursScreen } from "../../screens/Tours/ToursScreen";
import { TourScreen } from "../../screens/Tours/TourScreen";
import { ArticleScreen } from "../../screens/Articles/ArticleScreen";
import { ArticlesScreen } from "../../screens/Articles/ArticlesScreen";
import { ArticleConstructScreen } from "../../screens/Articles/ArticleConstructScreen";
import { ProfileScreen } from "../../screens/Profile/ProfileScreen";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BlockScreen } from "../../screens/BlockScreen";
import { ReviewScreen } from "../../screens/Profile/Review/ReviewScreen";
import { ReviewItemScreen } from "../../screens/Profile/Review/ReviewItemScreen";
import { ChatScreen } from "../../screens/Profile/ChatScreen";
import { AddTourScreen } from "../../screens/Profile/AddTourScreen";

export interface INavigationProps {}
export const Navigation: React.FC<INavigationProps> = function ({}) {
  const user = useSelector((state: RootState) => state.app.user);

  if (!!user && user?.block) {
    return (
      <Routes>
        <Route path="/" element={<BlockScreen />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/profile/chat" element={<ChatScreen />} />
        <Route path="/profile/tour/add" element={<AddTourScreen />} />
        <Route path="/profile/review" element={<ReviewScreen />} />
        <Route path="/profile/review/:id" element={<ReviewItemScreen />} />
        <Route path="/tours/:id" element={<TourScreen />} />
        <Route path="/tours" element={<ToursScreen />} />
        <Route path="/articles/:id" element={<ArticleScreen />} />
        <Route path="/articles" element={<ArticlesScreen />} />
        <Route path="/articles/create" element={<ArticleConstructScreen />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    );
  }
};
