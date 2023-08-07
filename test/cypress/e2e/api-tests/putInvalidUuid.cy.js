// invalidUuidPut.spec.js

describe('Invalid UUID Put Test', () => {
    it('should return status code 400 for an invalid UUID in the PUT request', () => {
      const putEndpointUrl = 'http://localhost:8080/todo/completed/invalid-uuid';
  
      // Send the request to the PUT endpoint with an invalid UUID and the invalid data
      cy.request({
        method: 'PUT',
        url: putEndpointUrl,
        failOnStatusCode: false, // We expect a 400 response, so we prevent Cypress from failing the test
      }).then((response) => {
        
        expect(response.status).to.eq(400); // Check if the response status code is 400 (Bad Request)
        expect(response.body).to.have.property('error','Bad Request');
        expect(response.body).to.have.property('path','/todo/completed/invalid-uuid');
      
    });
    });
  });
  