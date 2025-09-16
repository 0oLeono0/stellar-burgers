import * as tokens from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';

describe('Интеграционные тесты для конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
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
      modal.get('div:first-child > button > svg').click();

      cy.get('@modal').should('not.exist');
    });

    it('Закрытие по клику на оверлей', () => {
      cy.get(`[data-cy=bun]`).first().click();

      const modal = cy.get('#modals > div:first-child').as('modal');
      const overlay = cy.get('#modals > div:nth-child(2)');

      overlay.click({ force: true });

      cy.get('@modal').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' });
      cy.setCookie('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      cy.intercept('GET', '/api/auth/tokens', {
        fixture: 'token.json'
      });
      cy.intercept('POST', '/api/orders', { fixture: 'order.json' });
    });

    it('Симуляция создания заказа', () => {
      cy.get(`[data-cy=bun] > .common_button`).first().click();
      cy.get(`[data-cy=main] > .common_button`).first().click();
      cy.get(`[data-cy=sauce] > .common_button`).first().click();
      cy.get(
        '#root > div > main > div > section:nth-child(2) > div > button'
      ).click();

      const orderModal = cy.get('#modals > div:first-child').as('orderModal');
      const orderNumber = orderModal.get('div:nth-child(2) > h2');

      orderNumber.contains(orderData.order.number);

      orderModal
        .get('div:first-child > div:first-child > button > svg')
        .click();

      cy.get('@orderModal').should('not.exist');

      const burgerConstructor = {
        constructorBunTop: cy.get('div > section:nth-child(2) > div'),
        constructorMainIngredient: cy.get(
          'div > section:nth-child(2) > ul > div'
        ),
        constructorBunBottom: cy.get(
          'div > section:nth-child(2) > div:nth-child(3)'
        )
      };

      burgerConstructor.constructorBunTop.contains('Выберите булки');
      burgerConstructor.constructorMainIngredient.contains('Выберите начинку');
      burgerConstructor.constructorBunBottom.contains('Выберите булки');
    });

    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });
  });
});
