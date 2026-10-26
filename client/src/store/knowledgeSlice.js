import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

// Fetch all knowledge items
export const fetchAllKnowledge = createAsyncThunk(
  'knowledge/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const [clauses, facts, terms] = await Promise.all([
        api.getClauses(),
        api.getFacts(),
        api.getTerms(),
      ]);
      return { clauses, facts, terms };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch knowledge base');
    }
  }
);

// Clauses CRUD
export const addClause = createAsyncThunk(
  'knowledge/addClause',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.createClause(payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create clause');
    }
  }
);

export const editClause = createAsyncThunk(
  'knowledge/editClause',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await api.updateClause(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update clause');
    }
  }
);

export const removeClause = createAsyncThunk(
  'knowledge/removeClause',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteClause(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete clause');
    }
  }
);

// Facts CRUD
export const addFact = createAsyncThunk(
  'knowledge/addFact',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.createFact(payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create fact');
    }
  }
);

export const editFact = createAsyncThunk(
  'knowledge/editFact',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await api.updateFact(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update fact');
    }
  }
);

export const removeFact = createAsyncThunk(
  'knowledge/removeFact',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteFact(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete fact');
    }
  }
);

// Terms CRUD
export const addTerm = createAsyncThunk(
  'knowledge/addTerm',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.createTerm(payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create term');
    }
  }
);

export const editTerm = createAsyncThunk(
  'knowledge/editTerm',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await api.updateTerm(id, payload);
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update term');
    }
  }
);

export const removeTerm = createAsyncThunk(
  'knowledge/removeTerm',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteTerm(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete term');
    }
  }
);

const initialState = {
  clauses: [],
  facts: [],
  terms: [],
  loading: false,
  mutating: false,
  error: null,
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    clearKnowledgeError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllKnowledge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllKnowledge.fulfilled, (state, action) => {
        state.loading = false;
        state.clauses = action.payload.clauses;
        state.facts = action.payload.facts;
        state.terms = action.payload.terms;
      })
      .addCase(fetchAllKnowledge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clause actions
      .addCase(addClause.pending, (state) => {
        state.mutating = true;
      })
      .addCase(addClause.fulfilled, (state, action) => {
        state.mutating = false;
        state.clauses.unshift(action.payload);
      })
      .addCase(addClause.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload;
      })
      .addCase(editClause.fulfilled, (state, action) => {
        state.mutating = false;
        const index = state.clauses.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.clauses[index] = action.payload;
      })
      .addCase(removeClause.fulfilled, (state, action) => {
        state.mutating = false;
        state.clauses = state.clauses.filter((c) => c.id !== action.payload);
      })

      // Fact actions
      .addCase(addFact.fulfilled, (state, action) => {
        state.mutating = false;
        state.facts.unshift(action.payload);
      })
      .addCase(editFact.fulfilled, (state, action) => {
        state.mutating = false;
        const index = state.facts.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) state.facts[index] = action.payload;
      })
      .addCase(removeFact.fulfilled, (state, action) => {
        state.mutating = false;
        state.facts = state.facts.filter((f) => f.id !== action.payload);
      })

      // Term actions
      .addCase(addTerm.fulfilled, (state, action) => {
        state.mutating = false;
        state.terms.unshift(action.payload);
      })
      .addCase(editTerm.fulfilled, (state, action) => {
        state.mutating = false;
        const index = state.terms.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) state.terms[index] = action.payload;
      })
      .addCase(removeTerm.fulfilled, (state, action) => {
        state.mutating = false;
        state.terms = state.terms.filter((t) => t.id !== action.payload);
      });
  },
});

export const { clearKnowledgeError } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
