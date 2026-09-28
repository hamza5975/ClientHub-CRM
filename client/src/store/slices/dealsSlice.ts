import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDealsRequest, createDealRequest, updateDealRequest, deleteDealRequest } from '../../services/dealService';
import type { Deal, CreateDealInput, DealStage } from '../../types';

interface DealsState {
  items: Deal[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    search: string;
    stage: DealStage | '';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: DealsState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
  filters: {
    search: '',
    stage: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const fetchDeals = createAsyncThunk(
  'deals/fetchAll',
  async (filters: Partial<DealsState['filters']> = {}, { rejectWithValue }) => {
    try {
      return await fetchDealsRequest(filters);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch deals');
    }
  }
);

export const createDeal = createAsyncThunk(
  'deals/create',
  async (input: CreateDealInput, { rejectWithValue }) => {
    try {
      return await createDealRequest(input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to create deal');
    }
  }
);

export const updateDeal = createAsyncThunk(
  'deals/update',
  async ({ id, input }: { id: string; input: Partial<CreateDealInput> }, { rejectWithValue }) => {
    try {
      return await updateDealRequest(id, input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to update deal');
    }
  }
);

export const deleteDeal = createAsyncThunk(
  'deals/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteDealRequest(id);
      return id;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to delete deal');
    }
  }
);

const dealsSlice = createSlice({
  name: 'deals',
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
      .addCase(fetchDeals.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.deals;
        state.total = action.payload.total;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setFilters, clearError } = dealsSlice.actions;
export default dealsSlice.reducer;
