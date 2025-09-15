import { buns } from '../../../testData';
import ingredientsReducer, {
  IngredientsState,
  fetchIngredients
} from '../ingredientsSlice';

describe('Проверка асинхронных действий ингредиентов', () => {
  describe('Проверка получения ингредиентов (fetchIngredients)', () => {
    test('Проверка состояния запроса', async () => {
      const initialState: IngredientsState = {
        ingredients: [],
        loading: false,
        error: null
      };

      const newState = ingredientsReducer(
        initialState,
        fetchIngredients.pending('pending')
      );

      expect(newState.loading).toBeTruthy();
      expect(newState.error).toBeNull();
    });

    test('Проверка ошибки при запросе', async () => {
      const initialState: IngredientsState = {
        ingredients: [],
        loading: true,
        error: null
      };

      const error: Error = {
        name: 'rejected',
        message: 'Ошибка загрузки ингредиентов'
      };
      const newState = ingredientsReducer(
        initialState,
        fetchIngredients.rejected(error, 'rejected')
      );

      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBe(error.message);
    });

    test('Проверка успешного запроса', async () => {
      const initialState: IngredientsState = {
        ingredients: [],
        loading: true,
        error: null
      };

      const newState = ingredientsReducer(
        initialState,
        fetchIngredients.fulfilled(buns, 'fulfilled')
      );

      expect(newState.ingredients).toEqual(buns);
      expect(newState.loading).toBeFalsy();
      expect(newState.error).toBeNull();
    });
  });
});
