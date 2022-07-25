import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { IUser } from '../interfaces/';
interface IUserState {
  value: IUser;
}
const initialState: IUserState = {
  value: {
    id: null,
    first_name: '',
    initials: '',
    last_name: '',
    email: '',
    logged_in: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser: (state, action: PayloadAction<IUser>) => {
      state.value = action.payload;
    },
    clearUser: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { saveUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
