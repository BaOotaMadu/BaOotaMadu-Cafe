// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  // This line is critical: It reads the token from localStorage on app load
  token: localStorage.getItem('token') || null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      console.log("✅ auth/setToken reducer is running. Payload:", action.payload);
      localStorage.setItem('token', action.payload); // Keep localStorage in sync
      state.token = action.payload;
    },
    clearToken(state) {
      localStorage.removeItem('token'); // Keep localStorage in sync
      state.token = null;
    },
    showLoading(state) {
      state.loading = true;
    },
    hideLoading(state) {
      state.loading = false;
    },
  },
});

export const { setToken, clearToken, showLoading, hideLoading } = authSlice.actions;
export default authSlice.reducer;