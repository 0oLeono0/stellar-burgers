import { TNewOrderResponse } from '@api';
import { order } from '../../../testData';
import orderReducer, {
  OrderState,
  clearOrder,
  orderBurgerThunk,
  initialState
} from '../orderSlice';

describe('Проверка действий заказа', () => {
  describe('Проверка синхронного действия очистки заказа', () => {
    test('Проверка очистки заказа', () => {
      const state = { ...initialState, order };
      const newState = orderReducer(state, clearOrder());
      expect(newState).toEqual(initialState);
    });
  });

  describe('Проверка асинхронного действия создания заказа (orderBurgerThunk)', () => {
    test('Проверка состояния запроса', async () => {
      const newState = orderReducer(
        initialState,
        orderBurgerThunk.pending('pending', ['ingredient1'])
      );

      expect(newState.isOrderLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Проверка ошибки при запросе', async () => {
      const state = { ...initialState, isOrderLoading: true };
      const error: Error = {
        name: 'rejected',
        message: 'Ошибка создания заказа'
      };
      const newState = orderReducer(
        state,
        orderBurgerThunk.rejected(error, 'rejected', ['ingredient1'])
      );

      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Проверка успешного запроса', async () => {
      const state = { ...initialState, isOrderLoading: true };
      const newOrder: TNewOrderResponse = {
        order: order,
        name: 'new order',
        success: true
      };

      const newState = orderReducer(
        state,
        orderBurgerThunk.fulfilled(newOrder, 'fulfilled', ['ingredient1'])
      );

      expect(newState.order).toEqual(order);
      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
