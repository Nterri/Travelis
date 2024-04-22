import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadDataEnum } from "../components/LoadData/LoadData";
import { ArticlesType } from "../api/articles";

export interface ArticlesState {
  loading: LoadDataEnum;
  data: Array<ArticlesType>;
}

const initialState: ArticlesState = {
  loading: LoadDataEnum.NOT_LOADING,
  data: [],
};

export const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    setLoadArticles: (state, action: PayloadAction<LoadDataEnum>) => {
      state.loading = action.payload;
    },
    setDataArticles: (state, action: PayloadAction<Array<ArticlesType>>) => {
      state.data = action.payload;
      state.loading = !!action.payload
        ? LoadDataEnum.LOADED
        : LoadDataEnum.FAILED;
    },
  },
});

export const { setLoadArticles, setDataArticles } = articlesSlice.actions;

const articlesReducer = articlesSlice.reducer;

export default articlesReducer;
