import { configureStore } from '@reduxjs/toolkit';
import burgerConstructorReducer, {
  burgerConstructorState
} from './slices/constructorSlice';
import feedReducer, { FeedState } from './slices/feedSlice';
import ingredientsReducer, {
  IngredientsState
} from './slices/ingredientsSlice';
import orderReducer, { OrderState } from './slices/orderSlice';
import userReducer, { UserState } from './slices/userSlice';
import { rootReducer } from './store';

describe('Проверяют правильную инициализацию rootReducer', () => {
  const burgerConstructorInitialState: burgerConstructorState = {
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    error: null
  };

  const feedInitialState: FeedState = {
    orders: [],
    isFeedsLoading: false,
    order: null,
    isOrderLoading: false,
    total: 0,
    totalToday: 0,
    error: null
  };

  const ingredientsInitialState: IngredientsState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const orderInitialState: OrderState = {
    order: null,
    isOrderLoading: false,
    error: null
  };

  const userInitialState: UserState = {
    isAuthenticated: false,
    loginUserRequest: false,
    user: null,
    orders: [],
    ordersRequest: false,
    error: null
  };

  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      burgerConstructor: burgerConstructorInitialState,
      feed: feedInitialState,
      ingredients: ingredientsInitialState,
      order: orderInitialState,
      user: userInitialState
    }
  });

  test('Тест конструктора', () => {
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorReducer(burgerConstructorInitialState, {
        type: 'UNKNOWN_ACTION'
      })
    );

    const addIngredientAction = { type: 'addIngredient' };
    store.dispatch(addIngredientAction);
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorInitialState
    );

    const upIngredientAction = { type: 'upIngredient' };
    store.dispatch(upIngredientAction);
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorInitialState
    );

    const downIngredientAction = { type: 'downIngredient' };
    store.dispatch(downIngredientAction);
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorInitialState
    );

    const removeIngredientAction = { type: 'removeIngredient' };
    store.dispatch(removeIngredientAction);
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorInitialState
    );

    const clearBurgerConstructorAction = { type: 'clearBurgerConstructor' };
    store.dispatch(clearBurgerConstructorAction);
    expect(store.getState().burgerConstructor).toEqual(
      burgerConstructorInitialState
    );
  });

  test('Тест ленты заказов', () => {
    expect(store.getState().feed).toEqual(
      feedReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const getFeedsThunkAction = { type: 'getFeedsThunk' };
    store.dispatch(getFeedsThunkAction);
    expect(store.getState().feed).toEqual(feedInitialState);

    const getOrderByNumberThunkAction = { type: 'getOrderByNumberThunk' };
    store.dispatch(getOrderByNumberThunkAction);
    expect(store.getState().feed).toEqual(feedInitialState);
  });

  test('Тест ингредиентов', () => {
    expect(store.getState().ingredients).toEqual(
      ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const getIngredientsThunkAction = { type: 'getIngredientsThunk' };
    store.dispatch(getIngredientsThunkAction);
    expect(store.getState().ingredients).toEqual(ingredientsInitialState);
  });

  test('Тест заказа', () => {
    expect(store.getState().order).toEqual(
      orderReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const clearOrderAction = { type: 'clearOrder' };
    store.dispatch(clearOrderAction);
    expect(store.getState().order).toEqual(orderInitialState);

    const orderBurgerThunkAction = { type: 'orderBurgerThunk' };
    store.dispatch(orderBurgerThunkAction);
    expect(store.getState().order).toEqual(orderInitialState);
  });

  test('Тест пользователя', () => {
    expect(store.getState().user).toEqual(
      userReducer(undefined, { type: 'UNKNOWN_ACTION' })
    );

    const clearErrorsAction = { type: 'clearErrors' };
    store.dispatch(clearErrorsAction);
    expect(store.getState().user).toEqual(userInitialState);

    const loginUserThunkAction = { type: 'loginUserThunk' };
    store.dispatch(loginUserThunkAction);
    expect(store.getState().user).toEqual(userInitialState);

    const logoutUserThunkAction = { type: 'logoutUserThunk' };
    store.dispatch(logoutUserThunkAction);
    expect(store.getState().user).toEqual(userInitialState);

    const getUserThunkAction = { type: 'getUserThunk' };
    store.dispatch(getUserThunkAction);
    expect(store.getState().user).toEqual(userInitialState);

    const updateUserThunkAction = { type: 'updateUserThunk' };
    store.dispatch(updateUserThunkAction);
    expect(store.getState().user).toEqual(userInitialState);

    const getOrdersThunkAction = { type: 'getOrdersThunk' };
    store.dispatch(getOrdersThunkAction);
    expect(store.getState().user).toEqual(userInitialState);
  });
});
