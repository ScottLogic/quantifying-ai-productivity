describe('Invalid UUID Test', () => {
    it('should return status code 400 for an invalid UUID', () => {
      // Replace 'YOUR_ENDPOINT_URL' with the actual URL of your endpoint for the specific UUID
        const invalidUuid = 'invalid_uuid';
        cy.request({
            method: 'GET',
            url: `http://localhost:8080/todo/${invalidUuid}`,
            failOnStatusCode: false, // We expect a 400 response, so we prevent Cypress from failing the test
        }).then((response) => {
            expect(response.status).to.eq(400); // Check if the response status code is 400 (Bad Request)
        });
    });
});