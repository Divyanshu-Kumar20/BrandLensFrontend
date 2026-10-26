import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

export const fetchContentList = createAsyncThunk(
  'content/fetchList',
  async (status, { rejectWithValue }) => {
    try {
      const list = await api.getContentList(status);
      return list;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch content list');
    }
  }
);

const initialState = {
  list: [],
  current: null,
  versions: [],
  findings: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setContentList(state, action) {
      state.list = action.payload;
    },
    setCurrentContent(state, action) {
      const { content, versions = [] } = action.payload;
      state.current = content;
      state.versions = versions;
    },
    setFindings(state, action) {
      state.findings = action.payload;
    },
    updateFindingInList(state, action) {
      const updated = action.payload;
      const index = state.findings.findIndex((f) => f.id === updated.id);
      if (index !== -1) {
        state.findings[index] = updated;
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContentList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setContentList,
  setCurrentContent,
  setFindings,
  updateFindingInList,
  setLoading,
  setError,
} = contentSlice.actions;

export default contentSlice.reducer;
