import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import tokenReducer from '../features/tokenSlice';
import searchReducer from '../features/searchSlice';
import searchTotalReducer from '../features/searchTotalSlice';
import searchTypeReducer from '../features/searchTypeSlice';
import searchPageReducer from '../features/searchPageSlice';
import searchTotalPagesReducer from '../features/searchTotalPagesSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    token: tokenReducer,
    search: searchReducer,
    searchTotal: searchTotalReducer,
    searchType: searchTypeReducer,
    searchPage: searchPageReducer,
    searchTotalPages: searchTotalPagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
