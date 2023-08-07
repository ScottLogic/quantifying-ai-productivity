// createMissingDescription.spec.js

describe('Create Task with Missing Description Test', () => {
    it('should create a task with a missing description and return status code 400', () => {
      // Replace 'YOUR_CREATE_ENDPOINT_URL' with the actual URL of your endpoint to create tasks
      const createEndpointUrl = 'http://localhost:8080/todo/addTask?name=Missing Description';
  
      // Send a request to create a new task with missing description
      cy.request({
        method: 'POST',
        url: createEndpointUrl,
        failOnStatusCode: false,

      }).then((response) => {
        // Check if the response status code is 400
        expect(response.status).to.eq(400);
        expect(response.body.error).to.eq("Bad Request");
        expect(response.body).to.have.property('path','/todo/addTask?name=Missing%20Description');
      });
    });
  });
  