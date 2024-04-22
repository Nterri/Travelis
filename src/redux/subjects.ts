import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SubjectType = {
  id: number;
  name: string;
};

export interface SubjectsState {
  data: Array<SubjectType>;
}

const initialState: SubjectsState = {
  data: [],
};

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    setDateSubjects: (state, action: PayloadAction<Array<SubjectType>>) => {
      state.data = action.payload;
    },
  },
});

export const { setDateSubjects } = subjectsSlice.actions;

const subjectsReducer = subjectsSlice.reducer;

export default subjectsReducer;
