import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface ISearchState {
  value: any;
}
const initialState: ISearchState = {
  value: {
    searchResults: [],
  },
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    saveSearchResults: (state, action: PayloadAction<any>) => {
      state.value.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.value.searchResults = initialState.value;
    },
  },
});

export const { saveSearchResults, clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
