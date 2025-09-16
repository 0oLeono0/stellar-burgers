import { userOrders } from '../../../testData';
import userReducer, {
  UserState,
  clearErrors,
  getOrdersThunk,
  initialState
} from '../userSlice';

describe('Тесты синхронных экшенов', () => {
  test('Проверяем очистку заказа', () => {
    const state = { ...initialState, error: 'some error' };
    const newState = userReducer(state, clearErrors());
    expect(newState.error).toBeNull();
  });
});

describe('Тесты асинхронных экшенов', () => {
  describe('Тестируем getOrdersThunk', () => {
    test('Тестируем отправку запроса (pending)', async () => {
      const newState = userReducer(
        initialState,
        getOrdersThunk.pending('pending')
      );

      expect(newState.ordersRequest).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Тестируем ошибку при запросе (rejected)', async () => {
      const state = { ...initialState, ordersRequest: true };
      const error: Error = {
        name: 'rejected',
        message: 'Ошибка получения заказов пользователя'
      };
      const newState = userReducer(
        state,
        getOrdersThunk.rejected(error, 'rejected')
      );

      expect(newState.ordersRequest).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Тестируем успешный запрос (fulfilled)', async () => {
      const state = { ...initialState, ordersRequest: true };
      const newState = userReducer(
        state,
        getOrdersThunk.fulfilled(userOrders, 'fulfilled')
      );

      expect(newState.orders).toEqual(userOrders);
      expect(newState.ordersRequest).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
