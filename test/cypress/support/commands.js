Cypress.Commands.add('logApiRequestGET', (method, url, requestBody = null) => {
  cy.request({
    method: method,
    url: url,
    body: requestBody,
  }).then((response) => {
    // Log the number of items in the array
    const arrayLength = response.body.length;
    cy.log(`Received ${arrayLength} tasks from the API:`);

    // Log the properties of each object in the array
    response.body.forEach((item, index) => {
      const objectDetails = Object.entries(item)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      cy.log(`Task ${index + 1}: { ${objectDetails} }`);
    });
  });
});

Cypress.Commands.add('logApiRequestGETUuid', (response) => {
  // Log the properties of the response.body object
  const objectDetails = Object.entries(response.body)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
  cy.log(`{ ${objectDetails} }`);
});
