describe('HTTP PUT Endpoint Test: Mark Task as Complete', () => {
it('should mark the task as complete and validate the success and message fields', () => {
    // Task UUID to mark as complete
    const taskUUID = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';

    // Make a PUT request to mark the task as complete
    cy.request({
    method: 'PUT',
    url: `http://localhost:8080/todo/completed/${taskUUID}`,
    }).then((response) => {
    // Check that the response status code is 200
    expect(response.status).to.equal(200);

    // Validate the response JSON
    expect(response.body).to.deep.equal({
        success: true,
        message: 'This task has now been completed.',
    });
    });
});

});
describe('HTTP PUT Endpoint Test: Mark Task as Complete (Already Completed)', () => {
it('should return "Task already marked complete." when marking an already completed task', () => {
    // Task UUID that is already marked as complete
    const completedTaskUUID = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';

    // Make a PUT request to mark the task as complete again
    cy.request({
    method: 'PUT',
    url: `http://localhost:8080/todo/completed/${completedTaskUUID}`,
    }).then((response) => {
    // Check that the response status code is 200
    expect(response.status).to.equal(200);

    // Validate the response JSON
    expect(response.body).to.deep.equal({
        success: false,
        message: 'Task already marked complete.',
    });
    });
});
})
describe('HTTP PUT Endpoint Test: Mark Task as Complete (Already Completed)', () => {
    it('should return "Task already marked complete." when marking an already completed task', () => {
      // Task UUID that is not valid
      const invalidTaskUUID = '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34';
  
      // Make a PUT request to mark the task as complete again
      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${invalidTaskUUID}`,
      }).then((response) => {
        // Check that the response status code is 200
        expect(response.status).to.equal(200);
  
        // Validate the response JSON
        expect(response.body).to.deep.equal({
          success: false,
          message: 'Task not found.',
        });
      });
    });
})