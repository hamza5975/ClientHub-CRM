import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCompaniesRequest, createCompanyRequest, updateCompanyRequest, deleteCompanyRequest } from '../../services/companyService';
import type { Company, CreateCompanyInput } from '../../types';

interface CompaniesState {
  items: Company[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    search: string;
    industry: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: CompaniesState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
  filters: {
    search: '',
    industry: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const fetchCompanies = createAsyncThunk(
  'companies/fetchAll',
  async (filters: Partial<CompaniesState['filters']> = {}, { rejectWithValue }) => {
    try {
      return await fetchCompaniesRequest(filters);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch companies');
    }
  }
);

export const createCompany = createAsyncThunk(
  'companies/create',
  async (input: CreateCompanyInput, { rejectWithValue }) => {
    try {
      return await createCompanyRequest(input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to create company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'companies/update',
  async ({ id, input }: { id: string; input: Partial<CreateCompanyInput> }, { rejectWithValue }) => {
    try {
      return await updateCompanyRequest(id, input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to update company');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'companies/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCompanyRequest(id);
      return id;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to delete company');
    }
  }
);

const companiesSlice = createSlice({
  name: 'companies',
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
      .addCase(fetchCompanies.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.companies;
        state.total = action.payload.total;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setFilters, clearError } = companiesSlice.actions;
export default companiesSlice.reducer;
