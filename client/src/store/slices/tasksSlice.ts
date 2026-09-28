import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTasksRequest, createTaskRequest, updateTaskRequest, deleteTaskRequest } from '../../services/taskService';
import type { Task, CreateTaskInput, TaskStatus, TaskPriority } from '../../types';

interface TasksState {
  items: Task[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    search: string;
    status: TaskStatus | '';
    priority: TaskPriority | '';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: TasksState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
  filters: {
    search: '',
    status: '',
    priority: '',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  },
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (filters: Partial<TasksState['filters']> = {}, { rejectWithValue }) => {
    try {
      return await fetchTasksRequest(filters);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (input: CreateTaskInput, { rejectWithValue }) => {
    try {
      return await createTaskRequest(input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, input }: { id: string; input: Partial<CreateTaskInput> }, { rejectWithValue }) => {
    try {
      return await updateTaskRequest(id, input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTaskRequest(id);
      return id;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
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
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.tasks;
        state.total = action.payload.total;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setFilters, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
