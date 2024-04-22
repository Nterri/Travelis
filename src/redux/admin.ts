import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersType } from "../api/auth";
import { LoadDataEnum } from "../components/LoadData/LoadData";
import { ArticlesType } from "../api/articles";

export interface AdminState {
  loadingUser: LoadDataEnum;
  loadingReviewArticles: LoadDataEnum;
  users: Array<UsersType>;
  reviewArticles: Array<ArticlesType>;
}

const initialState: AdminState = {
  loadingUser: LoadDataEnum.NOT_LOADING,
  loadingReviewArticles: LoadDataEnum.NOT_LOADING,
  users: [],
  reviewArticles: [],
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLoadUsers: (state, action: PayloadAction<LoadDataEnum>) => {
      state.loadingUser = action.payload;
    },
    setLoadReviewArticles: (state, action: PayloadAction<LoadDataEnum>) => {
      state.loadingReviewArticles = action.payload;
    },
    setUsers: (state, action: PayloadAction<Array<UsersType>>) => {
      state.users = action.payload;
    },
    setReviewArticles: (state, action: PayloadAction<Array<ArticlesType>>) => {
      state.reviewArticles = action.payload;
    },
  },
});

export const {
  setLoadUsers,
  setUsers,
  setLoadReviewArticles,
  setReviewArticles,
} = adminSlice.actions;

const adminReducer = adminSlice.reducer;

export default adminReducer;
