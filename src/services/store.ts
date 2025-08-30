import { ThunkAction, ThunkDispatch, thunk } from 'redux-thunk';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

import burgerConstructor from './slices/constructorSlice';
import ingredients from './slices/ingredientsSlice';

export const rootReducer = combineReducers({
  burgerConstructor,
  ingredients
});

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof rootReducer>;

type TApplicationActions = any;

export type AppThunk<Return = void> = ThunkAction<
  Return,
  RootState,
  unknown,
  TApplicationActions
>;

export type AppDispatch = ThunkDispatch<RootState, never, TApplicationActions>;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
