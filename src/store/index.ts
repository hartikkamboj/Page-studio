// Redux Store — Configuration
// Combines slices + localStorage persistence middleware.

import { configureStore } from '@reduxjs/toolkit';
import draftPageReducer from './slices/draftPageSlice';
import uiReducer from './slices/uiSlice';
import publishReducer from './slices/publishSlice';
import { saveDraft } from '@/adapters/draftStorage';

const store = configureStore({
  reducer: {
    draftPage: draftPageReducer,
    ui: uiReducer,
    publish: publishReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(draftPersistenceMiddleware),
});

/**
 * Middleware: Persists draft to localStorage on every draftPage change.
 * This makes drafts reload-safe.
 */
function draftPersistenceMiddleware(storeAPI: { getState: () => RootState }) {
  return (next: (action: unknown) => unknown) =>
    (action: unknown) => {
      const result = next(action);

      // After any action, check if we should persist the draft
      const state = storeAPI.getState();
      if (state.draftPage.page && state.draftPage.isDirty) {
        saveDraft(state.draftPage.page.slug, state.draftPage.page);
      }

      return result;
    };
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
