import { TNewOrderResponse } from '@api';
import { order } from '../../../testData';
import orderReducer, {
  OrderState,
  clearOrder,
  orderBurgerThunk
} from '../orderSlice';

describe('Проверка действий заказа', () => {
  describe('Проверка синхронного действия очистки заказа', () => {
    test('Проверка очистки заказа', () => {
      const initialState: OrderState = {
        order: order,
        isOrderLoading: false,
        error: null
      };

      const newState = orderReducer(initialState, clearOrder());
      expect(newState).toEqual({
        order: null,
        isOrderLoading: false,
        error: null
      });
    });
  });

  describe('Проверка асинхронного действия создания заказа (orderBurgerThunk)', () => {
    test('Проверка состояния запроса', async () => {
      const initialState: OrderState = {
        order: null,
        isOrderLoading: false,
        error: null
      };

      const newState = orderReducer(
        initialState,
        orderBurgerThunk.pending('pending', ['ingredient1'])
      );

      expect(newState.isOrderLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Проверка ошибки при запросе', async () => {
      const initialState: OrderState = {
        order: null,
        isOrderLoading: true,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка создания заказа'
      };
      const newState = orderReducer(
        initialState,
        orderBurgerThunk.rejected(error, 'rejected', ['ingredient1'])
      );

      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Проверка успешного запроса', async () => {
      const initialState: OrderState = {
        order: null,
        isOrderLoading: true,
        error: null
      };

      const newOrder: TNewOrderResponse = {
        order: order,
        name: 'new order',
        success: true
      };

      const newState = orderReducer(
        initialState,
        orderBurgerThunk.fulfilled(newOrder, 'fulfilled', ['ingredient1'])
      );

      expect(newState.order).toEqual(order);
      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
