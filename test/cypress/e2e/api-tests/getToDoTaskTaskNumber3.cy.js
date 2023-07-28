// cypress/e2e/GenerativeAI.cy.js
//API test suite generated using ChatGPT for GET Method
describe('API Test Suite', () => {
    it('should fetch todo list from the API', () => {
      // Define the user ID and updated data
      //const uuid = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34',
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
  
      
        // Check if the first user has an 'id' and 'name' property
        expect(response.body).to.have.property('uuid', '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34')
        expect(response.body).to.have.property('name','Test generative AI')
        expect(response.body).to.have.property('description','Use generative AI technology to write a simple web service')
        expect(response.body).to.have.property('completed',null)
        expect(response.body).to.have.property('complete',false)
      });
    });
  });
  
  