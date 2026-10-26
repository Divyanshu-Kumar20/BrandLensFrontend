import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';

const token = localStorage.getItem('brandlens_token');
let user = null;
let org = null;

try {
  const cachedUser = localStorage.getItem('brandlens_user');
  if (cachedUser) user = JSON.parse(cachedUser);
  const cachedOrg = localStorage.getItem('brandlens_org');
  if (cachedOrg) org = JSON.parse(cachedOrg);
} catch (e) {
  console.error('Failed to parse cached auth state', e);
}

// Async thunk: Demo role login
export const loginWithDemo = createAsyncThunk(
  'auth/loginWithDemo',
  async (role, { rejectWithValue }) => {
    try {
      const response = await api.loginDemo(role);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Demo login failed');
    }
  }
);

// Async thunk: Email/password login
export const loginWithCredentials = createAsyncThunk(
  'auth/loginWithCredentials',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.login(email, password);
      return response;
    } catch (err) {
      return rejectWithValue(err.message || 'Invalid credentials');
    }
  }
);

const initialState = {
  user,
  org,
  token: token || null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.org = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('brandlens_token');
      localStorage.removeItem('brandlens_user');
      localStorage.removeItem('brandlens_org');
    },
    updateOrg(state, action) {
      state.org = { ...state.org, ...action.payload };
      localStorage.setItem('brandlens_org', JSON.stringify(state.org));
    },
    setUserAndOrg(state, action) {
      const { user, org } = action.payload;
      state.user = user;
      state.org = org;
      if (user) localStorage.setItem('brandlens_user', JSON.stringify(user));
      if (org) localStorage.setItem('brandlens_org', JSON.stringify(org));
    },
  },
  extraReducers: (builder) => {
    builder
      // Demo Login
      .addCase(loginWithDemo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithDemo.fulfilled, (state, action) => {
        const { user, org, token } = action.payload;
        state.loading = false;
        state.user = user;
        state.org = org;
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;
        if (token) localStorage.setItem('brandlens_token', token);
        if (user) localStorage.setItem('brandlens_user', JSON.stringify(user));
        if (org) localStorage.setItem('brandlens_org', JSON.stringify(org));
      })
      .addCase(loginWithDemo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      // Credentials Login
      .addCase(loginWithCredentials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithCredentials.fulfilled, (state, action) => {
        const { user, org, token } = action.payload;
        state.loading = false;
        state.user = user;
        state.org = org;
        state.token = token;
        state.isAuthenticated = true;
        state.error = null;
        if (token) localStorage.setItem('brandlens_token', token);
        if (user) localStorage.setItem('brandlens_user', JSON.stringify(user));
        if (org) localStorage.setItem('brandlens_org', JSON.stringify(org));
      })
      .addCase(loginWithCredentials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Invalid email or password';
      });
  },
});

export const { clearAuthError, logout, updateOrg, setUserAndOrg } = authSlice.actions;
export default authSlice.reducer;
