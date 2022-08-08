import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ISearchPageState {
  value: number;
}
const initialState: ISearchPageState = {
  value: 1,
};

export const searchPageSlice = createSlice({
  name: 'searchPage',
  initialState,
  reducers: {
    saveSearchPage: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    clearSearchPage: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { saveSearchPage, clearSearchPage } = searchPageSlice.actions;

export default searchPageSlice.reducer;
