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

describe('ToolsTransferLog e2e test', () => {
  const toolsTransferLogPageUrl = '/tools-transfer-log';
  const toolsTransferLogPageUrlPattern = new RegExp('/tools-transfer-log(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const toolsTransferLogSample = {};

  let toolsTransferLog: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tools-transfer-logs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tools-transfer-logs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tools-transfer-logs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (toolsTransferLog) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tools-transfer-logs/${toolsTransferLog.id}`,
      }).then(() => {
        toolsTransferLog = undefined;
      });
    }
  });

  it('ToolsTransferLogs menu should load ToolsTransferLogs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('tools-transfer-log');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ToolsTransferLog').should('exist');
    cy.url().should('match', toolsTransferLogPageUrlPattern);
  });

  describe('ToolsTransferLog page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(toolsTransferLogPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ToolsTransferLog page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/tools-transfer-log/new$'));
        cy.getEntityCreateUpdateHeading('ToolsTransferLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsTransferLogPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tools-transfer-logs',
          body: toolsTransferLogSample,
        }).then(({ body }) => {
          toolsTransferLog = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tools-transfer-logs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/tools-transfer-logs?page=0&size=20>; rel="last",<http://localhost/api/tools-transfer-logs?page=0&size=20>; rel="first"',
              },
              body: [toolsTransferLog],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(toolsTransferLogPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ToolsTransferLog page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('toolsTransferLog');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsTransferLogPageUrlPattern);
      });

      it('edit button click should load edit ToolsTransferLog page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ToolsTransferLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsTransferLogPageUrlPattern);
      });

      it('last delete button click should delete instance of ToolsTransferLog', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('toolsTransferLog').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsTransferLogPageUrlPattern);

        toolsTransferLog = undefined;
      });
    });
  });

  describe('new ToolsTransferLog page', () => {
    beforeEach(() => {
      cy.visit(`${toolsTransferLogPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ToolsTransferLog');
    });

    it('should create an instance of ToolsTransferLog', () => {
      cy.get(`[data-cy="name"]`).type('infrastructures uniform Intuitive').should('have.value', 'infrastructures uniform Intuitive');

      cy.get(`[data-cy="code"]`).type('bluetooth homogeneous').should('have.value', 'bluetooth homogeneous');

      cy.get(`[data-cy="startDate"]`).type('2024-01-15').should('have.value', '2024-01-15');

      cy.get(`[data-cy="serial"]`).type('Vatican').should('have.value', 'Vatican');

      cy.get(`[data-cy="departmentNew"]`).type('array Steel Utah').should('have.value', 'array Steel Utah');

      cy.get(`[data-cy="owner"]`).type('Loan lavender CSS').should('have.value', 'Loan lavender CSS');

      cy.get(`[data-cy="unit"]`).type('content overriding').should('have.value', 'content overriding');

      cy.get(`[data-cy="quantity"]`).type('7162').should('have.value', '7162');

      cy.get(`[data-cy="price"]`).type('53879').should('have.value', '53879');

      cy.get(`[data-cy="amount"]`).type('55923').should('have.value', '55923');

      cy.get(`[data-cy="status"]`).type('Account Dynamic unleash').should('have.value', 'Account Dynamic unleash');

      cy.get(`[data-cy="note"]`).type('synthesize homogeneous Berkshire').should('have.value', 'synthesize homogeneous Berkshire');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        toolsTransferLog = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', toolsTransferLogPageUrlPattern);
    });
  });
});
