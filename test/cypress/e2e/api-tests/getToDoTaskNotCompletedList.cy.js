// cypress/e2e/GenerativeAI.cy.js
//API test suite generated using ChatGPT for GET Method
describe('API Test Suite', () => {
    it('should fetch todo list from the API', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo?complete=false',
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
  
         // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
  
        // Check if the first user has an 'id' and 'name' property
        expect(response.body[0]).to.have.property('uuid');
        expect(response.body[0]).to.have.property('name');
      });
    });
  });
  
  