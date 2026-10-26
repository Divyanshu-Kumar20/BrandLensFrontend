import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import uiReducer from './uiSlice';
import contentReducer from './contentSlice';
import knowledgeReducer from './knowledgeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    content: contentReducer,
    knowledge: knowledgeReducer,
  },
});

export default store;
