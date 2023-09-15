describe('GET Task by UUID', () => {
  it('Get: Task Number 3', () => {
    const uuid = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';

    cy.request('GET', `http://localhost:8080/todo/${uuid}`).then((response) => {
      cy.fixture('tasks.json').then((tasks) => {
        const expectedTask = tasks.find((task) => task.uuid === uuid);

        expect(response.status).to.equal(200);
        expect(response.body.uuid).to.equal(expectedTask.uuid);
        expect(response.body.name).to.equal(expectedTask.name);
        expect(response.body.description).to.equal(expectedTask.description);
        expect(response.body.completed).to.be.null;
        expect(response.body.complete).to.be.false;
        cy.logApiRequestGETUuid(response);
      });
    });
  });

  it('Get: Task Not Found', () => {
    const uuid = '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34';

    cy.fixture('expectedResponses.json').then((expectedData) => {
      cy.request('GET', `http://localhost:8080/todo/${uuid}`).then(
        (response) => {
          expect(response.status).to.equal(200);
          expect(response.body.uuid).to.equal(expectedData.uuid);
          expect(response.body.name).to.equal(expectedData.name);
          expect(response.body.description).to.equal(expectedData.description);
          expect(response.body.completed).to.equal(expectedData.completed);
          expect(response.body.complete).to.equal(expectedData.complete);
          cy.logApiRequestGETUuid(response);
        }
      );
    });
  });

  it('Get: Invalid UUID', () => {
    const uuid = 'invalid-uuid';

    cy.request({
      method: 'GET',
      url: `http://localhost:8080/todo/${uuid}`,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      cy.logApiRequestGETUuid(response);
    });
  });
});
