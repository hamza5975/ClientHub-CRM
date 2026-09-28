import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchContactsRequest, createContactRequest, updateContactRequest, deleteContactRequest } from '../../services/contactService';
import type { Contact, CreateContactInput } from '../../types';

interface ContactsState {
  items: Contact[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    search: string;
    company: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
}

const initialState: ContactsState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
  filters: {
    search: '',
    company: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (filters: Partial<ContactsState['filters']> = {}, { rejectWithValue }) => {
    try {
      return await fetchContactsRequest(filters);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch contacts');
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/create',
  async (input: CreateContactInput, { rejectWithValue }) => {
    try {
      return await createContactRequest(input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to create contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/update',
  async ({ id, input }: { id: string; input: Partial<CreateContactInput> }, { rejectWithValue }) => {
    try {
      return await updateContactRequest(id, input);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to update contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteContactRequest(id);
      return id;
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      return rejectWithValue(error.response?.data?.error || 'Failed to delete contact');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
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
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.contacts;
        state.total = action.payload.total;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.total -= 1;
      });
  },
});

export const { setFilters, clearError } = contactsSlice.actions;
export default contactsSlice.reducer;
