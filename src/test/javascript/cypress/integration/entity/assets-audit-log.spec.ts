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

describe('AssetsAuditLog e2e test', () => {
  const assetsAuditLogPageUrl = '/assets-audit-log';
  const assetsAuditLogPageUrlPattern = new RegExp('/assets-audit-log(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const assetsAuditLogSample = {};

  let assetsAuditLog: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/assets-audit-logs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/assets-audit-logs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/assets-audit-logs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (assetsAuditLog) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/assets-audit-logs/${assetsAuditLog.id}`,
      }).then(() => {
        assetsAuditLog = undefined;
      });
    }
  });

  it('AssetsAuditLogs menu should load AssetsAuditLogs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('assets-audit-log');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AssetsAuditLog').should('exist');
    cy.url().should('match', assetsAuditLogPageUrlPattern);
  });

  describe('AssetsAuditLog page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(assetsAuditLogPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AssetsAuditLog page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/assets-audit-log/new$'));
        cy.getEntityCreateUpdateHeading('AssetsAuditLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetsAuditLogPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/assets-audit-logs',
          body: assetsAuditLogSample,
        }).then(({ body }) => {
          assetsAuditLog = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/assets-audit-logs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/assets-audit-logs?page=0&size=20>; rel="last",<http://localhost/api/assets-audit-logs?page=0&size=20>; rel="first"',
              },
              body: [assetsAuditLog],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(assetsAuditLogPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AssetsAuditLog page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('assetsAuditLog');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetsAuditLogPageUrlPattern);
      });

      it('edit button click should load edit AssetsAuditLog page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AssetsAuditLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetsAuditLogPageUrlPattern);
      });

      it('last delete button click should delete instance of AssetsAuditLog', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('assetsAuditLog').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetsAuditLogPageUrlPattern);

        assetsAuditLog = undefined;
      });
    });
  });

  describe('new AssetsAuditLog page', () => {
    beforeEach(() => {
      cy.visit(`${assetsAuditLogPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AssetsAuditLog');
    });

    it('should create an instance of AssetsAuditLog', () => {
      cy.get(`[data-cy="auditDate"]`).type('2024-01-15').should('have.value', '2024-01-15');

      cy.get(`[data-cy="name"]`).type('Islands experiences').should('have.value', 'Islands experiences');

      cy.get(`[data-cy="code"]`).type('users Spring Pants').should('have.value', 'users Spring Pants');

      cy.get(`[data-cy="serial"]`).type('monitor').should('have.value', 'monitor');

      cy.get(`[data-cy="type"]`).type('payment Gorgeous panel').should('have.value', 'payment Gorgeous panel');

      cy.get(`[data-cy="useTime"]`).type('2024-01-15').should('have.value', '2024-01-15');

      cy.get(`[data-cy="startDate"]`).type('2024-01-15').should('have.value', '2024-01-15');

      cy.get(`[data-cy="department"]`).type('Refined Berkshire').should('have.value', 'Refined Berkshire');

      cy.get(`[data-cy="status"]`).type('whiteboard').should('have.value', 'whiteboard');

      cy.get(`[data-cy="setupLocation"]`).type('USB modular').should('have.value', 'USB modular');

      cy.get(`[data-cy="quantity"]`).type('43415').should('have.value', '43415');

      cy.get(`[data-cy="note"]`).type('North national Chief').should('have.value', 'North national Chief');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        assetsAuditLog = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', assetsAuditLogPageUrlPattern);
    });
  });
});
