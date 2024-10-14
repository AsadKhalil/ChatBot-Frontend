import { createAction, createSlice } from '@reduxjs/toolkit';

export const initializeChatHistory = createAction('hrchat/initializeHistory');

const hrchatSlice = createSlice({
  name: 'hrchat',
  initialState: {
    hrchatHistory: [],
  },
  reducers: {
    addMessage(state, action) {
      state.hrchatHistory.push(action.payload);
    },
    clearHistory(state) {
      state.hrchatHistory = [];
    },
    updateChatHistory(state, action) {
      state.hrchatHistory = action.payload;
    },
  },
});

export const { addMessage, clearHistory, updateChatHistory} = hrchatSlice.actions;

export default hrchatSlice.reducer;
