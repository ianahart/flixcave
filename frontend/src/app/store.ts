import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import tokenReducer from '../features/tokenSlice';
import searchReducer from '../features/searchSlice';
import searchTotalReducer from '../features/searchTotalSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    token: tokenReducer,
    search: searchReducer,
    searchTotal: searchTotalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
