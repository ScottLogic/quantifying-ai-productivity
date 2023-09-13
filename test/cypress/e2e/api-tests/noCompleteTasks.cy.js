describe('No Completed Tasks', () => {
  it('Get Completed Tasks When None Completed', () => {
    cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
      expect(response.status).to.equal(200);
      const tasks = response.body;
      expect(tasks).to.have.length(0);
    });
  });
  it('Get Incomplete Tasks When None Are Complete', () => {
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      expect(response.status).to.equal(200);
      const tasks = response.body;
      expect(tasks).to.have.length(3);
      // Ensure that all tasks have "complete" set to false
      const allTasksAreIncomplete = tasks.every(task => task.complete === false);
      expect(allTasksAreIncomplete).to.be.true;
    });
  });
});
