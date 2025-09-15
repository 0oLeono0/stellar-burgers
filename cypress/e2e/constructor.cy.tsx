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

  describe('Модальное окно для ингредиента', () => {
    it('Открытие модального окна', () => {
      cy.get(`[data-cy=bun]`).first().click();

      const modal = cy.get('#modals > div:first-child');
      const header = modal.get('div:first-child > h3');

      header.contains('Краторная булка N-200i');
    });

    it('Закрытие по клику на крестик', () => {
      cy.get(`[data-cy=bun]`).first().click();

      const modal = cy.get('#modals > div:first-child').as('modal');
      const button = modal.get('div:first-child > button > svg').click();

      cy.get('modal').should('not.exist');
    });

    it('Закрытие по клику на оверлей', () => {
      cy.get(`[data-cy=bun]`).first().click();

      const modal = cy.get('#modals > div:first-child').as('modal');
      const overlay = modal.get('#modals > div:nth-child(2)');

      overlay.click({ force: true });

      cy.get('modal').should('not.exist');
    });
  });
});
