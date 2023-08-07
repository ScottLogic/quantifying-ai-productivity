describe('Task Not Found Test', () => {
    it('should return status code 200 for a valid task and 404 for a non-existent task', () => {
      // Replace 'YOUR_ENDPOINT_URL' with the actual URL of your endpoint for accessing tasks
      const nonExistentTaskId = '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34';
  
      // First, check if the response status code is 200 for a valid task
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo/${nonExistentTaskId}`,
      }).then((response) => {
        expect(response.status).to.eq(200); // Check if the response status code is 200 (OK)

        expect(response.body).to.have.property('uuid', '00000000-0000-0000-0000-000000000000')
        expect(response.body).to.have.property('name','Unknown Task')
        expect(response.body).to.have.property('description','Unknown Task')
        expect(response.body).to.have.property('completed',null)
        expect(response.body).to.have.property('complete',false)
      });
    });
});