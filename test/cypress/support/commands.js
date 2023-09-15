// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('logApiResponse', (url) => {
  cy.request('GET', url).then((response) => {
    // Log the response with properties and values for each object in the array
    response.body.forEach((item, index) => {
      const arrayLength = response.body.length;
      const objectDetails = Object.entries(item)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      cy.log(`Received ${arrayLength} tasks from the API:`);
      cy.log(`Task ${index + 1}: { ${objectDetails} }`);
    });
  });
});
