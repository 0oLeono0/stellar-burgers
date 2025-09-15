import { buns, notBuns } from '../../../testData';
import { v4 as uuidv4 } from 'uuid';
import burgerConstructorReducer, {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  clearBurgerConstructor
} from '../constructorSlice';

jest.mock('uuid');

describe('Проверка синхронных действий конструктора', () => {
  const clearInitialState = {
    burgerConstructor: {
      bun: null,
      ingredients: []
    },
    error: null
  };
  const filledInitialState = {
    burgerConstructor: {
      bun: {
        ...buns[0],
        id: '0'
      },
      ingredients: [
        {
          ...notBuns[0],
          id: '1'
        },
        {
          ...notBuns[0],
          id: '2'
        }
      ]
    },
    error: null
  };

  (uuidv4 as jest.Mock).mockImplementation(() => 1);

  test('Проверка добавления булки в пустой конструктор', () => {
    const bun = buns[0];
    const newState = burgerConstructorReducer(
      clearInitialState,
      addIngredient(bun)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.bun?.id).toEqual(1);
  });

  test('Проверка замены булки', () => {
    const bun = buns[1];
    const newState = burgerConstructorReducer(
      filledInitialState,
      addIngredient(bun)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.bun?._id).not.toEqual(buns[0]._id);
  });

  test('Проверка добавления ингредиента в пустой конструктор', () => {
    const ingredient = notBuns[0];
    const newState = burgerConstructorReducer(
      clearInitialState,
      addIngredient(ingredient)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.ingredients.length).toBe(1);
    expect(burgerConstructor.ingredients[0].id).toBe(1);
  });

  test('Проверка добавления ингредиента в непустой конструктор', () => {
    const ingredient = notBuns[0];
    const newState = burgerConstructorReducer(
      filledInitialState,
      addIngredient(ingredient)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.ingredients.length).toBe(3);
    expect(burgerConstructor.ingredients[2].id).toBe(1);
  });

  test('Проверка перемещения ингредиента вверх', () => {
    const newState = burgerConstructorReducer(
      filledInitialState,
      upIngredient(1)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.ingredients[0]._id).toBe(
      filledInitialState.burgerConstructor.ingredients[1]._id
    );
  });

  test('Проверка перемещения ингредиента вниз', () => {
    const newState = burgerConstructorReducer(
      filledInitialState,
      downIngredient(0)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.ingredients[1]._id).toBe(
      filledInitialState.burgerConstructor.ingredients[0]._id
    );
  });

  test('Проверка удаления ингредиента', () => {
    const removedIngredient =
      filledInitialState.burgerConstructor.ingredients[0];
    const newState = burgerConstructorReducer(
      filledInitialState,
      removeIngredient(removedIngredient)
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.ingredients.length).toBe(1);
    expect(burgerConstructor.ingredients).not.toContainEqual(removedIngredient);
  });

  test('Проверка очистки конструктора', () => {
    const newState = burgerConstructorReducer(
      filledInitialState,
      clearBurgerConstructor()
    );
    const { burgerConstructor } = newState;
    expect(burgerConstructor.bun).toBeNull();
    expect(burgerConstructor.ingredients.length).toBe(0);
  });
});
