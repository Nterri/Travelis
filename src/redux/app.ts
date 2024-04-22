import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersType } from "../api/auth";

export interface AppState {
  loading: boolean;
  user: UsersType | undefined;
}

const initialState: AppState = {
  loading: false,
  user: undefined,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setLoadApp: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserApp: (state, action: PayloadAction<UsersType | undefined>) => {
      state.user = action.payload;
    },
  },
});

export const { setLoadApp, setUserApp } = appSlice.actions;

const appReducer = appSlice.reducer;

export default appReducer;
