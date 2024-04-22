import { configureStore } from "@reduxjs/toolkit";
import articlesReducer from "./articles";
import appReducer from "./app";
import subjectsReducer from "./subjects";
import adminReducer from "./admin";
import chatReducer from "./chat";
import toursReducer from "./tours";

export const store = configureStore({
  reducer: {
    app: appReducer,
    articles: articlesReducer,
    subjects: subjectsReducer,
    admin: adminReducer,
    chat: chatReducer,
    tours: toursReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
