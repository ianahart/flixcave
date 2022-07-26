import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { ITokens } from '../interfaces/';
interface ITokensState {
  value: ITokens;
}
const initialState: ITokensState = {
  value: {
    access_token: '',
    refresh_token: '',
  },
};

export const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    saveTokens: (state, action: PayloadAction<ITokens>) => {
      state.value = action.payload;
      localStorage.setItem('tokens', JSON.stringify(state.value));
    },
    clearTokens: (state) => {
      localStorage.removeItem('tokens');
      state.value = initialState.value;
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.value.access_token = action.payload;
    },
  },
});

export const { saveTokens, clearTokens, updateAccessToken } = tokenSlice.actions;

export default tokenSlice.reducer;
