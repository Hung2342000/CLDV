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

describe('Asset e2e test', () => {
  const assetPageUrl = '/asset';
  const assetPageUrlPattern = new RegExp('/asset(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const assetSample = {};

  let asset: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/assets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/assets').as('postEntityRequest');
    cy.intercept('DELETE', '/api/assets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (asset) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/assets/${asset.id}`,
      }).then(() => {
        asset = undefined;
      });
    }
  });

  it('Assets menu should load Assets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('asset');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Asset').should('exist');
    cy.url().should('match', assetPageUrlPattern);
  });

  describe('Asset page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(assetPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Asset page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/asset/new$'));
        cy.getEntityCreateUpdateHeading('Asset');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/assets',
          body: assetSample,
        }).then(({ body }) => {
          asset = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/assets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/assets?page=0&size=20>; rel="last",<http://localhost/api/assets?page=0&size=20>; rel="first"',
              },
              body: [asset],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(assetPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Asset page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('asset');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetPageUrlPattern);
      });

      it('edit button click should load edit Asset page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Asset');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetPageUrlPattern);
      });

      it('last delete button click should delete instance of Asset', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('asset').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetPageUrlPattern);

        asset = undefined;
      });
    });
  });

  describe('new Asset page', () => {
    beforeEach(() => {
      cy.visit(`${assetPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Asset');
    });

    it('should create an instance of Asset', () => {
      cy.get(`[data-cy="name"]`).type('indigo').should('have.value', 'indigo');

      cy.get(`[data-cy="code"]`).type('didactic Personal Concrete').should('have.value', 'didactic Personal Concrete');

      cy.get(`[data-cy="serial"]`).type('Orchestrator Shirt coherent').should('have.value', 'Orchestrator Shirt coherent');

      cy.get(`[data-cy="type"]`).type('program Uruguay alarm').should('have.value', 'program Uruguay alarm');

      cy.get(`[data-cy="useTime"]`).type('2024-01-07').should('have.value', '2024-01-07');

      cy.get(`[data-cy="startDate"]`).type('2024-01-07').should('have.value', '2024-01-07');

      cy.get(`[data-cy="department"]`).type('SMS Toys Account').should('have.value', 'SMS Toys Account');

      cy.get(`[data-cy="status"]`).type('Wyoming').should('have.value', 'Wyoming');

      cy.get(`[data-cy="setupLocation"]`).type('Electronics Extended').should('have.value', 'Electronics Extended');

      cy.get(`[data-cy="quantity"]`).type('95276').should('have.value', '95276');

      cy.get(`[data-cy="note"]`).type('web-readiness Soap').should('have.value', 'web-readiness Soap');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        asset = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', assetPageUrlPattern);
    });
  });
});
