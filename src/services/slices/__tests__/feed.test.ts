import { TFeedsResponse, TOrderResponse } from '@api';
import { userOrders } from '../../../testData';
import feedReducer, {
  FeedState,
  getFeedsThunk,
  getOrderByNumberThunk
} from '../feedSlice';

describe('Проверка асинхронных действий ленты заказов', () => {
  describe('Проверка получения списка заказов (getFeedsThunk)', () => {
    test('Проверка состояния запроса', async () => {
      const initialState: FeedState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const newState = feedReducer(
        initialState,
        getFeedsThunk.pending('pending')
      );

      expect(newState.isFeedsLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Проверка ошибки при запросе', async () => {
      const initialState: FeedState = {
        orders: [],
        isFeedsLoading: true,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка загрузки заказов'
      };
      const newState = feedReducer(
        initialState,
        getFeedsThunk.rejected(error, 'rejected')
      );

      expect(newState.isFeedsLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Проверка успешного запроса', async () => {
      const initialState: FeedState = {
        orders: [],
        isFeedsLoading: true,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const feeds: TFeedsResponse = {
        orders: userOrders,
        total: 10,
        totalToday: 20,
        success: true
      };

      const newState = feedReducer(
        initialState,
        getFeedsThunk.fulfilled(feeds, 'fulfilled')
      );

      expect(newState.orders).toEqual(userOrders);
      expect(newState.total).toEqual(10);
      expect(newState.totalToday).toEqual(20);
      expect(newState.isFeedsLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });

  describe('Проверка получения заказа по номеру (getOrderByNumberThunk)', () => {
    test('Проверка состояния запроса', async () => {
      const initialState: FeedState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: false,
        total: 0,
        totalToday: 0,
        error: null
      };

      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.pending('pending', 1)
      );

      expect(newState.isOrderLoading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Проверка ошибки при запросе', async () => {
      const initialState: FeedState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: true,
        total: 0,
        totalToday: 0,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка загрузки заказа'
      };
      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.rejected(error, 'rejected', 1)
      );

      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Проверка успешного запроса', async () => {
      const initialState: FeedState = {
        orders: [],
        isFeedsLoading: false,
        order: null,
        isOrderLoading: true,
        total: 0,
        totalToday: 0,
        error: null
      };

      const orders: TOrderResponse = {
        orders: [userOrders[0]],
        success: true
      };

      const newState = feedReducer(
        initialState,
        getOrderByNumberThunk.fulfilled(orders, 'fulfilled', 1)
      );

      expect(newState.order).toEqual(userOrders[0]);
      expect(newState.isOrderLoading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
