// Put Endpoints Test Task 3

describe('PUT Request to Mark Task as Completed', () => {
    it('Should return an appropriate response for a non-existing task', () => {
      // Send a PUT request to complete a task that does not exist
      cy.request({
        method: 'PUT',
        url: 'http://localhost:8080/todo/completed/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34',
      }).then((response) => {
        // Check the response status code
        expect(response.status).to.equal(200);
  
        // Check that success is false
        expect(response.body.success).to.be.false;
  
        // Check the message for an appropriate error message
        expect(response.body.message).to.equal('Task not found.');
      });
    });
  });
  