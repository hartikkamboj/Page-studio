// Redux Slice: ui
// Manages editor UI state (selected section, panel visibility, mode).
// Completely isolated from page data and publish state.

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  selectedSectionId: string | null;
  isPanelOpen: boolean;
  editorMode: 'edit' | 'preview';
}

const initialState: UIState = {
  selectedSectionId: null,
  isPanelOpen: true,
  editorMode: 'edit',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectSection(state, action: PayloadAction<string>) {
      state.selectedSectionId = action.payload;
    },

    deselectSection(state) {
      state.selectedSectionId = null;
    },

    togglePanel(state) {
      state.isPanelOpen = !state.isPanelOpen;
    },

    setPanel(state, action: PayloadAction<boolean>) {
      state.isPanelOpen = action.payload;
    },

    setEditorMode(state, action: PayloadAction<'edit' | 'preview'>) {
      state.editorMode = action.payload;
    },
  },
});

export const {
  selectSection,
  deselectSection,
  togglePanel,
  setPanel,
  setEditorMode,
} = uiSlice.actions;

export default uiSlice.reducer;
