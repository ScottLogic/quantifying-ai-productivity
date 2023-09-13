describe('Completed Tasks', () => {
    it('Completed Tasks Have Correct Completed Timestamp', () => {
      // Get the current time
      const now = new Date().toISOString();
      const taskUuid = 'fd5ff9df-f194-4c6e-966a-71b38f95e14f';
      cy.request('PUT', `http://localhost:8080/todo/completed/${taskUuid}`).then((response) => {
        expect(response.body).to.have.property('success', true);
        cy.request('GET', `http://localhost:8080/todo/${taskUuid}`).then((response) => {
         // Crop now and response.body.completed so they are only up to seconds
        const nowWithoutMs = now.slice(0, 19);
        const completedWithoutMs = response.body.completed.slice(0, 19);
        // Check the completed time is the same as the time the PUT request was sent up to the second
        expect(completedWithoutMs).to.equal(nowWithoutMs);
        expect(response.body.name).to.equal('Mow the lawn');
        });
      });
    });
it('Get Completed Tasks Once Single Task Complete', () => {
    cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
        expect(response.status).to.equal(200);
        // Check the response body is an array of size 1
        expect(response.body).to.be.an('array');
        expect(response.body.length).to.equal(1);
        expect(response.body[0]).to.have.property('name', 'Mow the lawn');
    });
    });
});
  