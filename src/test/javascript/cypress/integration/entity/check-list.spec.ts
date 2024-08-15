import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('CheckList e2e test', () => {
  const checkListPageUrl = '/check-list';
  const checkListPageUrlPattern = new RegExp('/check-list(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const checkListSample = {};

  let checkList: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/check-lists+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/check-lists').as('postEntityRequest');
    cy.intercept('DELETE', '/api/check-lists/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (checkList) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/check-lists/${checkList.id}`,
      }).then(() => {
        checkList = undefined;
      });
    }
  });

  it('CheckLists menu should load CheckLists page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('check-list');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('CheckList').should('exist');
    cy.url().should('match', checkListPageUrlPattern);
  });

  describe('CheckList page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(checkListPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create CheckList page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/check-list/new$'));
        cy.getEntityCreateUpdateHeading('CheckList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', checkListPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/check-lists',
          body: checkListSample,
        }).then(({ body }) => {
          checkList = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/check-lists+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/check-lists?page=0&size=20>; rel="last",<http://localhost/api/check-lists?page=0&size=20>; rel="first"',
              },
              body: [checkList],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(checkListPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details CheckList page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('checkList');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', checkListPageUrlPattern);
      });

      it('edit button click should load edit CheckList page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('CheckList');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', checkListPageUrlPattern);
      });

      it('last delete button click should delete instance of CheckList', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('checkList').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', checkListPageUrlPattern);

        checkList = undefined;
      });
    });
  });

  describe('new CheckList page', () => {
    beforeEach(() => {
      cy.visit(`${checkListPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('CheckList');
    });

    it('should create an instance of CheckList', () => {
      cy.get(`[data-cy="name"]`).type('Pizza').should('have.value', 'Pizza');

      cy.get(`[data-cy="year"]`).type('Awesome best-of-breed').should('have.value', 'Awesome best-of-breed');

      cy.get(`[data-cy="reason"]`).type('2024-02-26').should('have.value', '2024-02-26');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        checkList = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', checkListPageUrlPattern);
    });
  });
});
