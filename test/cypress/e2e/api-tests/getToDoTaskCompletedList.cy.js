// cypress/e2e/GenerativeAI.cy.js
//API test suite generated using ChatGPT for GET Method
describe('API Test Suite', () => {
    it('should fetch todo list from the API', () => {
      cy.request({
        method: 'GET',
        //url: 'https://example-api.com/users',
        url: 'http://localhost:8080/todo?complete=true',
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
  
         // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
  
      });
    });
  });
  
  