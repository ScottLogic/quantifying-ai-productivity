describe('Valid Completing Tasks', () => {
it('Complete A Task', () => {
    const taskUUID = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
    cy.request({
    method: 'PUT',
    url: `http://localhost:8080/todo/completed/${taskUUID}`,
    }).then((response) => {
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
        success: true,
        message: 'This task has now been completed.',
    });
    });
  }); 
  it('Task Already Completed', () => {
      const completedTaskUUID = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
      cy.request({
      method: 'PUT',
      url: `http://localhost:8080/todo/completed/${completedTaskUUID}`,
      }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
          success: false,
          message: 'Task already marked complete.',
      });
    });
  });
  it('Valid UUID, But Not Associated To A Task', () => {
    const nonAssociatedTaskUUID = '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34';
    cy.request({
      method: 'PUT',
      url: `http://localhost:8080/todo/completed/${nonAssociatedTaskUUID}`,
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        success: false,
        message: 'Task not found.',
      });
    });
  });
})