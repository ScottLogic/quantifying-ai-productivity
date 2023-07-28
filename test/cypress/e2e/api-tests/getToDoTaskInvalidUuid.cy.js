//To check invalid uuid. Took copy from getToDoTaskList.cy.js and amended. 
describe('API Test Suite', () => {
    it('should fetch todo list from the API', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo/invalid-uuid',
        failOnStatusCode: false,//This will not fail our tests
        
      }).then((response) => {
        // Assertion example: Check if the response status code is 400 (Bad request)
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('error', 'Bad Request')
        expect(response.body).to.have.property('path', '/todo/invalid-uuid')
  
      });
    });
  });
  
  