import { buns } from '../../../testData';
import ingredientsReducer, {
  IngredientsState,
  fetchIngredients,
  initialState
} from '../ingredientsSlice';

describe('Проверка асинхронных действий ингредиентов', () => {
  describe('Проверка получения ингредиентов (fetchIngredients)', () => {
    test('Проверка состояния запроса', async () => {
      const newState = ingredientsReducer(
        initialState,
        fetchIngredients.pending('pending')
      );

      expect(newState.loading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Проверка ошибки при запросе', async () => {
      const state = { ...initialState, loading: true };
      const error: Error = {
        name: 'rejected',
        message: 'Ошибка загрузки ингредиентов'
      };
      const newState = ingredientsReducer(
        state,
        fetchIngredients.rejected(error, 'rejected')
      );

      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Проверка успешного запроса', async () => {
      const state = { ...initialState, loading: true };
      const newState = ingredientsReducer(
        state,
        fetchIngredients.fulfilled(buns, 'fulfilled')
      );

      expect(newState.ingredients).toEqual(buns);
      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
