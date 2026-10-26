import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast(state, action) {
      state.toasts.push({
        id: Date.now() + Math.random().toString(),
        ...action.payload,
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
