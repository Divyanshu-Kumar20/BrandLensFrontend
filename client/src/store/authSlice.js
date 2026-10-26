import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('brandlens_token');
let user = null;
let org = null;

try {
  const cachedUser = localStorage.getItem('brandlens_user');
  if (cachedUser) user = JSON.parse(cachedUser);
  const cachedOrg = localStorage.getItem('brandlens_org');
  if (cachedOrg) org = JSON.parse(cachedOrg);
} catch (e) {
  console.error('Failed to parse cached auth', e);
}

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
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action) {
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
    },
    authFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
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
  },
});

export const { authStart, authSuccess, authFailure, logout, updateOrg } = authSlice.actions;
export default authSlice.reducer;
