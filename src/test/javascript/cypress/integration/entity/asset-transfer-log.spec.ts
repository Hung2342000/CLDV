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

describe('AssetTransferLog e2e test', () => {
  const assetTransferLogPageUrl = '/asset-transfer-log';
  const assetTransferLogPageUrlPattern = new RegExp('/asset-transfer-log(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const assetTransferLogSample = {};

  let assetTransferLog: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/asset-transfer-logs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/asset-transfer-logs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/asset-transfer-logs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (assetTransferLog) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/asset-transfer-logs/${assetTransferLog.id}`,
      }).then(() => {
        assetTransferLog = undefined;
      });
    }
  });

  it('AssetTransferLogs menu should load AssetTransferLogs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('asset-transfer-log');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AssetTransferLog').should('exist');
    cy.url().should('match', assetTransferLogPageUrlPattern);
  });

  describe('AssetTransferLog page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(assetTransferLogPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AssetTransferLog page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/asset-transfer-log/new$'));
        cy.getEntityCreateUpdateHeading('AssetTransferLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetTransferLogPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/asset-transfer-logs',
          body: assetTransferLogSample,
        }).then(({ body }) => {
          assetTransferLog = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/asset-transfer-logs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/asset-transfer-logs?page=0&size=20>; rel="last",<http://localhost/api/asset-transfer-logs?page=0&size=20>; rel="first"',
              },
              body: [assetTransferLog],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(assetTransferLogPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AssetTransferLog page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('assetTransferLog');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetTransferLogPageUrlPattern);
      });

      it('edit button click should load edit AssetTransferLog page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AssetTransferLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetTransferLogPageUrlPattern);
      });

      it('last delete button click should delete instance of AssetTransferLog', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('assetTransferLog').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', assetTransferLogPageUrlPattern);

        assetTransferLog = undefined;
      });
    });
  });

  describe('new AssetTransferLog page', () => {
    beforeEach(() => {
      cy.visit(`${assetTransferLogPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AssetTransferLog');
    });

    it('should create an instance of AssetTransferLog', () => {
      cy.get(`[data-cy="name"]`).type('withdrawal grow').should('have.value', 'withdrawal grow');

      cy.get(`[data-cy="code"]`).type('Steel Rubber').should('have.value', 'Steel Rubber');

      cy.get(`[data-cy="startDate"]`).type('2024-03-24').should('have.value', '2024-03-24');

      cy.get(`[data-cy="transferDate"]`).type('2024-03-25').should('have.value', '2024-03-25');

      cy.get(`[data-cy="serial"]`).type('Granite').should('have.value', 'Granite');

      cy.get(`[data-cy="departmentNew"]`).type('methodologies Nepal Account').should('have.value', 'methodologies Nepal Account');

      cy.get(`[data-cy="departmentOld"]`).type('olive').should('have.value', 'olive');

      cy.get(`[data-cy="owner"]`).type('quantify Albania auxiliary').should('have.value', 'quantify Albania auxiliary');

      cy.get(`[data-cy="unit"]`).type('Expressway calculating').should('have.value', 'Expressway calculating');

      cy.get(`[data-cy="quantity"]`).type('29982').should('have.value', '29982');

      cy.get(`[data-cy="status"]`).type('Account Plastic').should('have.value', 'Account Plastic');

      cy.get(`[data-cy="note"]`).type('lavender').should('have.value', 'lavender');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        assetTransferLog = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', assetTransferLogPageUrlPattern);
    });
  });
});
