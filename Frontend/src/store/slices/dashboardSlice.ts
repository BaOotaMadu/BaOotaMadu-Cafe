import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Activity {
  id: number;
  type: 'order' | 'payment' | 'reservation' | 'other';
  message: string;
  timestamp: string;
}

interface StatData {
  totalOrders: string;
  dailyRevenue: string;
  activeTables: string;
  pendingOrders: string;
  trendOrders?: { value: string; positive: boolean };
  trendRevenue?: { value: string; positive: boolean };
  trendPendingOrders?: { value: string; positive: boolean };
}

interface DashboardState {
  stats: StatData;
  recentActivity: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: {
    totalOrders: "124",
    dailyRevenue: "$1,431",
    activeTables: "7/12",
    pendingOrders: "3",
    trendOrders: { value: "12%", positive: true },
    trendRevenue: { value: "8%", positive: true },
    trendPendingOrders: { value: "2", positive: false }
  },
  recentActivity: [
    { id: 1, type: 'order', message: 'New order placed', timestamp: '5 minutes ago' },
    { id: 2, type: 'order', message: 'New order placed', timestamp: '10 minutes ago' },
    { id: 3, type: 'payment', message: 'Payment received', timestamp: '15 minutes ago' },
    { id: 4, type: 'order', message: 'New order placed', timestamp: '20 minutes ago' },
    { id: 5, type: 'reservation', message: 'New reservation', timestamp: '25 minutes ago' },
  ],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<Partial<StatData>>) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    addActivity: (state, action: PayloadAction<Omit<Activity, 'id'>>) => {
      const newId = state.recentActivity.length > 0 
        ? Math.max(...state.recentActivity.map(a => a.id)) + 1 
        : 1;
      
      state.recentActivity.unshift({
        id: newId,
        ...action.payload
      });
      
      // Keep only the 5 most recent activities
      if (state.recentActivity.length > 5) {
        state.recentActivity = state.recentActivity.slice(0, 5);
      }
    },
    updateStats: (state, action: PayloadAction<Partial<StatData>>) => {
      state.stats = { ...state.stats, ...action.payload };
    }
  }
});

export const { setStats, addActivity, updateStats } = dashboardSlice.actions;

export default dashboardSlice.reducer;
