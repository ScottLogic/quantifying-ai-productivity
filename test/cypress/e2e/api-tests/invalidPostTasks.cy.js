describe('Create Invalid Tasks', () => {
    it('Create new task with invalid description', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask',
        failOnStatusCode: false, // Allow non-200 responses
        qs: {
          name: 'Name'
        }
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.equal('Bad Request');
        });
    });
  it('Create new task with no name', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask',
      failOnStatusCode: false,
      qs: {
        description: 'Description'
      }
    })
      .should((response) => {
        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error');
        expect(response.body.error).to.equal('Bad Request');
      });
  });
});
