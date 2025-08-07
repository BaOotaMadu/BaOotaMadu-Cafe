// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

// Import the reducers from your slices
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// This is the heart of your Redux setup.
// It combines all your reducers into a single store.
export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
});

// These types are essential for using Redux with TypeScript
// They help you use useSelector and useDispatch without type errors
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;