import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLeadsRequest, createLeadRequest, updateLeadRequest, deleteLeadRequest } from '../../services/leadService';
import type { Lead, CreateLeadInput, LeadStage } from '../../types';

interface LeadsState {
  items: Lead[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    search: string;
    stage: LeadStage | '';
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: LeadsState = {
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

export const fetchLeads = createAsyncThunk(
  'leads/fetchAll',
  async (filters: Partial<LeadsState['filters']> = {}, { rejectWithValue }) => {
    try {
      return await fetchLeadsRequest(filters);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch leads');
    }
  }
);

export const createLead = createAsyncThunk(
  'leads/create',
  async (input: CreateLeadInput, { rejectWithValue }) => {
    try {
      return await createLeadRequest(input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to create lead');
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ id, input }: { id: string; input: Partial<CreateLeadInput> }, { rejectWithValue }) => {
    try {
      return await updateLeadRequest(id, input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to update lead');
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteLeadRequest(id);
      return id;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to delete lead');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
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
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.leads;
        state.total = action.payload.total;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setFilters, clearError } = leadsSlice.actions;
export default leadsSlice.reducer;
