import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface ISearchTypeState {
  value: string;
}
const initialState: ISearchTypeState = {
  value: 'movie',
};

export const searchTypeSlice = createSlice({
  name: 'searchType',
  initialState,
  reducers: {
    saveSearchType: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
    clearSearchType: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { saveSearchType } = searchTypeSlice.actions;

export default searchTypeSlice.reducer;
