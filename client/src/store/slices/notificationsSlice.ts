import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNotificationsRequest, markNotificationAsReadRequest, markAllNotificationsAsReadRequest, deleteNotificationRequest, fetchUnreadCountRequest } from '../../services/notificationService';
import type { Notification, NotificationType } from '../../types';

interface NotificationsState {
  items: Notification[];
  total: number;
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    type: NotificationType | '';
    read: boolean | undefined;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: NotificationsState = {
  items: [],
  total: 0,
  unreadCount: 0,
  status: 'idle',
  error: null,
  filters: {
    type: '',
    read: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (filters: Partial<NotificationsState['filters']> = {}, { rejectWithValue }) => {
    try {
      return await fetchNotificationsRequest(filters);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUnreadCountRequest();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      return await markNotificationAsReadRequest(id);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsReadRequest();
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteNotificationRequest(id);
      return id;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to delete notification');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.notifications;
        state.total = action.payload.total;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((item) => ({ ...item, read: true }));
        state.unreadCount = 0;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedItem = state.items.find((item) => item._id === action.payload);
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
        if (deletedItem && !deletedItem.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      });
  },
});

export const { setFilters, clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer;
