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

describe('Tool e2e test', () => {
  const toolPageUrl = '/tool';
  const toolPageUrlPattern = new RegExp('/tool(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const toolSample = {};

  let tool: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/tools+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/tools').as('postEntityRequest');
    cy.intercept('DELETE', '/api/tools/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (tool) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/tools/${tool.id}`,
      }).then(() => {
        tool = undefined;
      });
    }
  });

  it('Tools menu should load Tools page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('tool');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Tool').should('exist');
    cy.url().should('match', toolPageUrlPattern);
  });

  describe('Tool page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(toolPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Tool page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/tool/new$'));
        cy.getEntityCreateUpdateHeading('Tool');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/tools',
          body: toolSample,
        }).then(({ body }) => {
          tool = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/tools+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/tools?page=0&size=20>; rel="last",<http://localhost/api/tools?page=0&size=20>; rel="first"',
              },
              body: [tool],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(toolPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Tool page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('tool');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolPageUrlPattern);
      });

      it('edit button click should load edit Tool page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Tool');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolPageUrlPattern);
      });

      it('last delete button click should delete instance of Tool', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('tool').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', toolPageUrlPattern);

        tool = undefined;
      });
    });
  });

  describe('new Tool page', () => {
    beforeEach(() => {
      cy.visit(`${toolPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Tool');
    });

    it('should create an instance of Tool', () => {
      cy.get(`[data-cy="name"]`).type('Cambridgeshire Regional').should('have.value', 'Cambridgeshire Regional');

      cy.get(`[data-cy="code"]`).type('copy Rubber port').should('have.value', 'copy Rubber port');

      cy.get(`[data-cy="startDate"]`).type('2024-01-04').should('have.value', '2024-01-04');

      cy.get(`[data-cy="serial"]`).type('Developer').should('have.value', 'Developer');

      cy.get(`[data-cy="department"]`).type('schemas').should('have.value', 'schemas');

      cy.get(`[data-cy="owner"]`).type('networks program').should('have.value', 'networks program');

      cy.get(`[data-cy="unit"]`).type('Strategist foreground').should('have.value', 'Strategist foreground');

      cy.get(`[data-cy="quantity"]`).type('52257').should('have.value', '52257');

      cy.get(`[data-cy="price"]`).type('17334').should('have.value', '17334');

      cy.get(`[data-cy="amount"]`).type('7075').should('have.value', '7075');

      cy.get(`[data-cy="status"]`).type('Concrete Springs Granite').should('have.value', 'Concrete Springs Granite');

      cy.get(`[data-cy="note"]`).type('Oregon East Plastic').should('have.value', 'Oregon East Plastic');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        tool = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', toolPageUrlPattern);
    });
  });
});
