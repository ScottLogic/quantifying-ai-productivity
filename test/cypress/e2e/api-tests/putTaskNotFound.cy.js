describe('PUT API Test Suite', () => {
    it('should update user information via PUT request', () => {
      // Define the user ID and updated data
      const uuid = 'fd5ff9df-f194-1a3b-966a-71b38f95e14f';

      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${uuid}`,
      
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('success',false);
        expect(response.body).to.have.property('message','Task not found.');

      });
    });
});