// src/store/slices/authSlice.ts
import { createSlice, PayloadAction, configureStore } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

// ✅ Create store here
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// ✅ Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default authSlice.reducer;
