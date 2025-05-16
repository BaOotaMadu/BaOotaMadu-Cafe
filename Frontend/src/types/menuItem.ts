// 1. First, let's create our types for menu items
// src/types/menuItem.ts
export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
}

// 2. Now, let's create our Redux slice for menu items
// src/redux/features/menuItems/menuItemsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '../../../types/menuItem';

interface MenuItemsState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuItemsState = {
  items: [],
  isLoading: false,
  error: null,
};

const menuItemsSlice = createSlice({
  name: 'menuItems',
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    toggleItemAvailability: (state, action: PayloadAction<{ id: string; available: boolean }>) => {
      const { id, available } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.available = available;
      }
    },
    deleteMenuItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // You can add more actions for editing, adding new items, etc.
  },
});

export const { 
  setMenuItems, 
  toggleItemAvailability, 
  deleteMenuItem 
} = menuItemsSlice.actions;

export default menuItemsSlice.reducer;

// 3. Let's set up our Redux store
// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import menuItemsReducer from './features/menuItems/menuItemsSlice';

export const store = configureStore({
  reducer: {
    menuItems: menuItemsReducer,
    // Add other reducers here as needed
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 4. Create typed hooks for using Redux with TypeScript
// src/redux/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;