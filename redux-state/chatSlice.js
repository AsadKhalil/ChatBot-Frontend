import { createAction, createSlice } from '@reduxjs/toolkit';

export const initializeChatHistory = createAction('chat/initializeHistory');

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chatHistory: [],
  },
  reducers: {
    addMessage(state, action) {
      state.chatHistory.push(action.payload);
    },
    clearHistory(state) {
      state.chatHistory = [];
    },
    updateChatHistory(state, action) {
      state.chatHistory = action.payload;
    },
  },
});

export const { addMessage, clearHistory, updateChatHistory} = chatSlice.actions;

export default chatSlice.reducer;
