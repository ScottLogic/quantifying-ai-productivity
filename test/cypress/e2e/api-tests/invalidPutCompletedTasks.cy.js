describe('Invalid Update Task Completion', () => {
    it('Update Invalid UUID To Completed', () => {
        const invalidUUID=1;
      cy.request({ method: 'PUT',
      url: `http://localhost:8080/todo/completed/${invalidUUID}`,
      failOnStatusCode: false, // Allow non-200 responses
    })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.have.property('error');
          expect(response.body.error).to.equal('Bad Request');
        });
    });
  });