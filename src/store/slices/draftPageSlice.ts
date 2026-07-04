// Redux Slice: draftPage
// Manages the page being edited in the studio.

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Page, Section } from '@/domain/models/page';
import { v4 as uuidv4 } from 'uuid';

export interface DraftPageState {
  page: Page | null;
  isDirty: boolean;
  isLoaded: boolean;
  error: string | null;
}

const initialState: DraftPageState = {
  page: null,
  isDirty: false,
  isLoaded: false,
  error: null,
};

const draftPageSlice = createSlice({
  name: 'draftPage',
  initialState,
  reducers: {
    /** Load a page into the editor */
    setDraftPage(state, action: PayloadAction<Page>) {
      state.page = action.payload;
      state.isDirty = false;
      state.isLoaded = true;
      state.error = null;
    },

    /** Set an error state */
    setDraftError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isLoaded = true;
    },

    /** Add a new section to the end of the page */
    addSection(
      state,
      action: PayloadAction<{ type: Section['type']; props: Record<string, unknown> }>
    ) {
      if (!state.page) return;
      const newSection: Section = {
        id: uuidv4(),
        type: action.payload.type,
        props: action.payload.props,
      };
      state.page.sections.push(newSection);
      state.isDirty = true;
    },

    /** Remove a section by ID */
    removeSection(state, action: PayloadAction<string>) {
      if (!state.page) return;
      state.page.sections = state.page.sections.filter(
        (s) => s.id !== action.payload
      );
      state.isDirty = true;
    },

    /** Move a section up or down */
    moveSection(
      state,
      action: PayloadAction<{ sectionId: string; direction: 'up' | 'down' }>
    ) {
      if (!state.page) return;
      const { sectionId, direction } = action.payload;
      const sections = state.page.sections;
      const index = sections.findIndex((s) => s.id === sectionId);

      if (index === -1) return;
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === sections.length - 1) return;

      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [sections[index], sections[swapIndex]] = [sections[swapIndex], sections[index]];
      state.isDirty = true;
    },

    /** Update props on a specific section (shallow merge) */
    updateSectionProps(
      state,
      action: PayloadAction<{ sectionId: string; props: Record<string, unknown> }>
    ) {
      if (!state.page) return;
      const section = state.page.sections.find(
        (s) => s.id === action.payload.sectionId
      );
      if (!section) return;
      section.props = { ...section.props, ...action.payload.props };
      state.isDirty = true;
    },

    /** Reset draft to clean state */
    resetDraft(state) {
      state.page = null;
      state.isDirty = false;
      state.isLoaded = false;
      state.error = null;
    },

    /** Mark the draft as saved (not dirty) */
    markClean(state) {
      state.isDirty = false;
    },
  },
});

export const {
  setDraftPage,
  setDraftError,
  addSection,
  removeSection,
  moveSection,
  updateSectionProps,
  resetDraft,
  markClean,
} = draftPageSlice.actions;

export default draftPageSlice.reducer;
