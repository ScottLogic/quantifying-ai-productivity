describe('Expect the complete list to have length 0 when no complete tasks', () => {
  it('should load tasks with complete=true', () => {
    // Make a GET request directly to the endpoint
    cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
      // Check that the response status code is 200
      expect(response.status).to.equal(200);

      // Get the tasks from the response body
      const tasks = response.body;

      // Ensure that the length of the returned array is0
      expect(tasks).to.have.length(0);

    });
  });

  // Additional test cases for this scenario can be added here
});
describe('HTTP GET Endpoint Test: All Tasks with complete=false', () => {
  it('should load tasks with complete=false', () => {
    // Make a GET request directly to the endpoint
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      // Check that the response status code is 200
      expect(response.status).to.equal(200);

      // Get the tasks from the response body
      const tasks = response.body;

      // Ensure that the length of the returned array is greater than 0
      expect(tasks).to.have.length.above(0);

      // Ensure that all tasks have "complete" set to false
      const allTasksAreIncomplete = tasks.every(task => task.complete === false);
      expect(allTasksAreIncomplete).to.be.true;
    });
  });

  // Additional test cases for this scenario can be added here
});
