// taskNotFoundPut.spec.js

describe('Task Not Found in PUT Test', () => {
    it('should return status code 200 when updating a non-existent task', () => {
      // Replace 'NON_EXISTENT_TASK_ID' with the ID of a non-existent task
      const nonExistentTaskId = 'fd5ff9df-f194-1a3b-966a-71b38f95e14f';
  
      // Replace 'YOUR_PUT_ENDPOINT_URL' with the actual URL of your PUT endpoint
      const putEndpointUrl = `http://localhost:8080/todo/completed/${nonExistentTaskId}`;
  
      // Send the request to update a non-existent task
      cy.request({
        method: 'PUT',
        url: putEndpointUrl,
      }).then((response) => {
        expect(response.status).to.eq(200); // Check if the response status code is 404 (Not Found)
        expect(response.body).to.have.property('success',false);
        expect(response.body).to.have.property('message','Task not found.');
      });
    });
  });
  