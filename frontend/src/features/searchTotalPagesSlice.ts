import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface ISearchTotalPagesState {
  value: number;
}
const initialState: ISearchTotalPagesState = {
  value: 0,
};

export const searchTotalPagesSlice = createSlice({
  name: 'searchTotalPages',
  initialState,
  reducers: {
    saveSearchTotalPages: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    clearSearchTotalPages: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { saveSearchTotalPages, clearSearchTotalPages } =
  searchTotalPagesSlice.actions;

export default searchTotalPagesSlice.reducer;
