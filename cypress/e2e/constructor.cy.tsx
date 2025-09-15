describe('Интеграционные тесты для конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000/');
  });
  describe('Загрузка ингредиентов', () => {
    it('Добавление ингредиентов в заказ', () => {
      cy.request('/api/ingredients');
      cy.get(`[data-cy=bun] > .common_button`).first().click();
      cy.get(`[data-cy=main] > .common_button`).first().click();
      cy.get(`[data-cy=sauce] > .common_button`).first().click();
      const burgerConstructor = {
        bunTop: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .first(),
        mainIngredient: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .eq(1),
        sauceIngredient: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .eq(2),
        bunBottom: cy
          .get(
            '.constructor-element > .constructor-element__row > .constructor-element__text'
          )
          .last()
      };
      burgerConstructor.bunTop.contains('Краторная булка N-200i (верх)');
      burgerConstructor.mainIngredient.contains(
        'Биокотлета из марсианской Магнолии'
      );
      burgerConstructor.sauceIngredient.contains('Соус Spicy-X');
      burgerConstructor.bunBottom.contains('Краторная булка N-200i (низ)');
    });
  });
});
