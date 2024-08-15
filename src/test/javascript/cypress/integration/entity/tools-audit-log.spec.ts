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

describe('ToolsAuditLog e2e test', () => {
  const toolsAuditLogPageUrl = '/tools-audit-log';
  const toolsAuditLogPageUrlPattern = new RegExp('/tools-audit-log(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const toolsAuditLogSample = {};

  let toolsAuditLog: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tools-audit-logs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tools-audit-logs').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tools-audit-logs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (toolsAuditLog) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tools-audit-logs/${toolsAuditLog.id}`,
      }).then(() => {
        toolsAuditLog = undefined;
      });
    }
  });

  it('ToolsAuditLogs menu should load ToolsAuditLogs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('tools-audit-log');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('ToolsAuditLog').should('exist');
    cy.url().should('match', toolsAuditLogPageUrlPattern);
  });

  describe('ToolsAuditLog page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(toolsAuditLogPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create ToolsAuditLog page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/tools-audit-log/new$'));
        cy.getEntityCreateUpdateHeading('ToolsAuditLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsAuditLogPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tools-audit-logs',
          body: toolsAuditLogSample,
        }).then(({ body }) => {
          toolsAuditLog = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tools-audit-logs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/tools-audit-logs?page=0&size=20>; rel="last",<http://localhost/api/tools-audit-logs?page=0&size=20>; rel="first"',
              },
              body: [toolsAuditLog],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(toolsAuditLogPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details ToolsAuditLog page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('toolsAuditLog');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsAuditLogPageUrlPattern);
      });

      it('edit button click should load edit ToolsAuditLog page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('ToolsAuditLog');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsAuditLogPageUrlPattern);
      });

      it('last delete button click should delete instance of ToolsAuditLog', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('toolsAuditLog').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolsAuditLogPageUrlPattern);

        toolsAuditLog = undefined;
      });
    });
  });

  describe('new ToolsAuditLog page', () => {
    beforeEach(() => {
      cy.visit(`${toolsAuditLogPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('ToolsAuditLog');
    });

    it('should create an instance of ToolsAuditLog', () => {
      cy.get(`[data-cy="auditDate"]`).type('2024-01-15').should('have.value', '2024-01-15');

      cy.get(`[data-cy="name"]`).type('overriding').should('have.value', 'overriding');

      cy.get(`[data-cy="code"]`).type('Fantastic Graphical back-end').should('have.value', 'Fantastic Graphical back-end');

      cy.get(`[data-cy="startDate"]`).type('2024-01-16').should('have.value', '2024-01-16');

      cy.get(`[data-cy="serial"]`).type('copying bricks-and-clicks software').should('have.value', 'copying bricks-and-clicks software');

      cy.get(`[data-cy="department"]`).type('model deposit').should('have.value', 'model deposit');

      cy.get(`[data-cy="owner"]`).type('Steel Organic Loan').should('have.value', 'Steel Organic Loan');

      cy.get(`[data-cy="unit"]`).type('North navigate').should('have.value', 'North navigate');

      cy.get(`[data-cy="quantity"]`).type('49670').should('have.value', '49670');

      cy.get(`[data-cy="price"]`).type('801').should('have.value', '801');

      cy.get(`[data-cy="amount"]`).type('63717').should('have.value', '63717');

      cy.get(`[data-cy="status"]`).type('driver').should('have.value', 'driver');

      cy.get(`[data-cy="note"]`).type('Small').should('have.value', 'Small');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        toolsAuditLog = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', toolsAuditLogPageUrlPattern);
    });
  });
});
