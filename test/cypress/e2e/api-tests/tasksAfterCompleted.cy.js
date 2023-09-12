describe('Todo API', () => {
    it('Marks a task as completed', () => {
      // Get the current time
      const now = new Date().toISOString();
  
      // Abstract the uuid to a variable called taskUuid
      const taskUuid = 'fd5ff9df-f194-4c6e-966a-71b38f95e14f';
  
      // Send a PUT request to mark the task as completed and set the completed time to now
      cy.request('PUT', `http://localhost:8080/todo/completed/${taskUuid}`).then((response) => {
        // Check the response body has the "success":true line
        expect(response.body).to.have.property('success', true);
  
        // Get the task
        cy.request('GET', `http://localhost:8080/todo/${taskUuid}`).then((response) => {
         // Crop now and response.body.completed so they are only up to seconds
        const nowWithoutMs = now.slice(0, 19);
        const completedWithoutMs = response.body.completed.slice(0, 19);

        // Check the completed time is the same as the time the PUT request was sent up to the second
        expect(completedWithoutMs).to.equal(nowWithoutMs);
          // Check the task name is "Mow the Lawn"
        expect(response.body.name).to.equal('Mow the lawn');
        });
      });
    });
  });
describe('Todo API', () => {
it('Gets all tasks with complete boolean set as true', () => {
    // Get all tasks with the complete boolean set to true
    cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
        // Check the response status code is 200
        expect(response.status).to.equal(200);

        // Check the response body is an array of size 1
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.equal(1);
        expect(response.body[0]).to.have.property('name', 'Mow the lawn');
    });
    });
});
  