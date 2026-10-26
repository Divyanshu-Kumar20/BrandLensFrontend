import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  clauses: [],
  facts: [],
  terms: [],
  loading: false,
  error: null,
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    setClauses(state, action) {
      state.clauses = action.payload;
    },
    setFacts(state, action) {
      state.facts = action.payload;
    },
    setTerms(state, action) {
      state.terms = action.payload;
    },
    setKnowledgeLoading(state, action) {
      state.loading = action.payload;
    },
    setKnowledgeError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setClauses,
  setFacts,
  setTerms,
  setKnowledgeLoading,
  setKnowledgeError,
} = knowledgeSlice.actions;

export default knowledgeSlice.reducer;
