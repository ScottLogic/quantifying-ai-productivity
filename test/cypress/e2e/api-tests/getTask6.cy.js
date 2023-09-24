// Get Endpoints Test Task 6

describe('API Test_Get: Invalid UUID', () => {
    it('should return HTTP status 400 Bad Request for an invalid UUID', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo/invalid-uuid',
        failOnStatusCode: false, // This allows us to handle non-2xx responses
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });
  
  