import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoadDataEnum } from "../components/LoadData/LoadData";
import { TourType } from "../api/tours";

export interface ToursState {
  loading: LoadDataEnum;
  data: Array<TourType>;
}

const initialState: ToursState = {
  loading: LoadDataEnum.NOT_LOADING,
  data: [],
};

export const toursSlice = createSlice({
  name: "tours",
  initialState,
  reducers: {
    setLoadTours: (state, action: PayloadAction<LoadDataEnum>) => {
      state.loading = action.payload;
    },
    setDataTours: (state, action: PayloadAction<Array<TourType>>) => {
      state.data = action.payload;
      state.loading = !!action.payload
        ? LoadDataEnum.LOADED
        : LoadDataEnum.FAILED;
    },
  },
});

export const { setLoadTours, setDataTours } = toursSlice.actions;

const toursReducer = toursSlice.reducer;

export default toursReducer;
