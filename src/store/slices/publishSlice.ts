// Redux Slice: publish
// Manages the publish workflow state (loading, success, error).
// Isolated from page data and UI state.

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { ChangeEntry } from '@/domain/models/release';
import type { RootState } from '@/store';

export interface PublishState {
  status: 'idle' | 'loading' | 'success' | 'error';
  lastPublishedVersion: string | null;
  changelog: ChangeEntry[];
  error: string | null;
}

const initialState: PublishState = {
  status: 'idle',
  lastPublishedVersion: null,
  changelog: [],
  error: null,
};

/**
 * Async thunk: publishes the current draft via the API route.
 * This calls POST /api/publish which is server-side enforced.
 */
export const publishDraft = createAsyncThunk(
  'publish/publishDraft',
  async (slug: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const page = state.draftPage.page;

    if (!page) {
      return rejectWithValue('No draft to publish');
    }

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, draft: page }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || `Publish failed: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      return rejectWithValue('Network error during publish');
    }
  }
);

const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    resetPublish(state) {
      state.status = 'idle';
      state.error = null;
      state.changelog = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishDraft.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(publishDraft.fulfilled, (state, action) => {
        state.status = 'success';
        state.lastPublishedVersion = action.payload.version;
        state.changelog = action.payload.changes || [];
        state.error = null;
      })
      .addCase(publishDraft.rejected, (state, action) => {
        state.status = 'error';
        state.error = (action.payload as string) || 'Unknown error';
      });
  },
});

export const { resetPublish } = publishSlice.actions;
export default publishSlice.reducer;
