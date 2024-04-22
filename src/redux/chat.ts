import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChatState {
  loadingSendChat: boolean;
  users: Array<number>;
}

const initialState: ChatState = {
  loadingSendChat: false,
  users: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLoadingChat: (state, action: PayloadAction<boolean>) => {
      state.loadingSendChat = action.payload;
    },
    setChatUsers: (state, action: PayloadAction<Array<number>>) => {
      state.users = action.payload;
    },
  },
});

export const { setLoadingChat, setChatUsers } = chatSlice.actions;

const chatReducer = chatSlice.reducer;

export default chatReducer;
