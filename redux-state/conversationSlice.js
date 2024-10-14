import { createAction, createSlice } from '@reduxjs/toolkit';

export const initializeConversationHistory = createAction('conversations/initializeHistory');

const conversationSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversationHistory: [],
  },
  reducers: {
    addConversation(state, action) {
      state.conversationHistory.push(action.payload);
    },
    clearConversationHistory(state) {
      state.conversationHistory = [];
    },
    updateConversationHistory(state, action) {
      state.conversationHistory = action.payload;
    },
  },
});

export const { addConversation, clearConversationHistory, updateConversationHistory } = conversationSlice.actions;

export default conversationSlice.reducer;
