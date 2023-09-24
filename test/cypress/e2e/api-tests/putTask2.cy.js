// Put Endpoints Test Task 2

describe('Complete Task API Tests_Already Completed', () => {
    let task2Uuid;
  
    // Before running the tests, assume task 2 is not completed
    before(() => {
      cy.request('GET', 'http://localhost:8080/todo').then((response) => {
        task2Uuid = response.body[1].uuid; // Assuming task 2 is the second task in the list
      });
    });
  
    it('should complete a task using PUT request', () => {
      // Mark task 2 as completed
      cy.request('PUT', `http://localhost:8080/todo/completed/${task2Uuid}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).not.to.be.true;
        expect(response.body.message).to.contain('Task already marked complete.');
      });
    });
  
    it('should get the list of completed tasks and check that the array is populated', () => {
      // Get the list of completed tasks
      cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.greaterThan(0);
  
        // Assuming task 2 is now completed, check its details
        const completedTask = response.body.find((task) => task.uuid === task2Uuid);
        expect(completedTask).to.exist;
        expect(completedTask.uuid).to.eq(task2Uuid);
        expect(completedTask.name).to.eq('Mow the lawn');
        expect(completedTask.description).to.eq('Mow the lawn in the back garden');
        // Compare the created date in milliseconds since Epoch
        expect(Date.parse(completedTask.created)).to.eq(Date.parse('2023-06-23T09:00:00Z'));
        expect(completedTask.completed).not.to.be.null;
        expect(completedTask.complete).to.be.true;
      });
    });
  
    it('should complete task 2 using PUT request', () => {
      // Mark task 2 as completed again (to prepare for the next test)
      cy.request('PUT', `http://localhost:8080/todo/completed/${task2Uuid}`).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.false;
        expect(response.body.message).to.contain('Task already marked complete.');
      });
    });
  
    it('should get the list of completed tasks and check that the array is empty', () => {
      // Get the list of completed tasks (should be empty after marking task 2 as completed again)
      cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(1);
      });
    });
  });