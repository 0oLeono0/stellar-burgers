import * as tokens from '../fixtures/token.json';
import * as orderData from '../fixtures/order.json';

// Константы для повторяющихся селекторов
const BUN_SELECTOR = '[data-cy=bun]';
const COMMON_BUTTON_SELECTOR = '.common_button';
const MODAL_SELECTOR = '#modals > div:first-child';
const CONSTRUCTOR_TEXT_SELECTOR =
  '.constructor-element > .constructor-element__row > .constructor-element__text';

describe('Интеграционные тесты для конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  describe('Загрузка ингредиентов', () => {
    it('Добавление ингредиентов в заказ', () => {
      cy.request('/api/ingredients');
      cy.get(`${BUN_SELECTOR} > ${COMMON_BUTTON_SELECTOR}`).first().click();
      cy.get(`[data-cy=main] > ${COMMON_BUTTON_SELECTOR}`).first().click();
      cy.get(`[data-cy=sauce] > ${COMMON_BUTTON_SELECTOR}`).first().click();

      const burgerConstructor = {
        bunTop: cy.get(CONSTRUCTOR_TEXT_SELECTOR).first(),
        mainIngredient: cy.get(CONSTRUCTOR_TEXT_SELECTOR).eq(1),
        sauceIngredient: cy.get(CONSTRUCTOR_TEXT_SELECTOR).eq(2),
        bunBottom: cy.get(CONSTRUCTOR_TEXT_SELECTOR).last()
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
      cy.get(BUN_SELECTOR).first().click();

      const modal = cy.get(MODAL_SELECTOR);
      const header = modal.get('div:first-child > h3');

      header.contains('Краторная булка N-200i');
    });

    it('Закрытие по клику на крестик', () => {
      cy.get(BUN_SELECTOR).first().click();

      const modal = cy.get(MODAL_SELECTOR).as('modal');
      modal.get('div:first-child > button > svg').click();

      cy.get('@modal').should('not.exist');
    });

    it('Закрытие по клику на оверлей', () => {
      cy.get(BUN_SELECTOR).first().click();

      const modal = cy.get(MODAL_SELECTOR).as('modal');
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
      cy.get(`${BUN_SELECTOR} > ${COMMON_BUTTON_SELECTOR}`).first().click();
      cy.get(`[data-cy=main] > ${COMMON_BUTTON_SELECTOR}`).first().click();
      cy.get(`[data-cy=sauce] > ${COMMON_BUTTON_SELECTOR}`).first().click();
      cy.get(
        '#root > div > main > div > section:nth-child(2) > div > button'
      ).click();

      const orderModal = cy.get(MODAL_SELECTOR).as('orderModal');
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
