import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ISearchTotal } from '../interfaces/';
interface ISearchTotalState {
  value: ISearchTotal;
}
const initialState: ISearchTotalState = {
  value: {
    person: 0,
    tv: 0,
    movie: 0,
    collection: 0,
  },
};

export const searchTotalSlice = createSlice({
  name: 'searchTotal',
  initialState,
  reducers: {
    saveSearchTotal: (state, action: PayloadAction<ISearchTotal>) => {
      state.value = action.payload;
    },
    clearSearchTotal: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { saveSearchTotal } = searchTotalSlice.actions;

export default searchTotalSlice.reducer;
