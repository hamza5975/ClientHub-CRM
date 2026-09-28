import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import contactsReducer from './slices/contactsSlice';
import companiesReducer from './slices/companiesSlice';
import dealsReducer from './slices/dealsSlice';
import tasksReducer from './slices/tasksSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    leads: leadsReducer,
    contacts: contactsReducer,
    companies: companiesReducer,
    deals: dealsReducer,
    tasks: tasksReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
